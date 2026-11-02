import struct
import sys

opnames = {
    0x00: 'nop', 0x01: 'aconst_null', 0x02: 'iconst_m1', 0x03: 'iconst_0',
    0x04: 'iconst_1', 0x05: 'iconst_2', 0x06: 'iconst_3', 0x07: 'iconst_4',
    0x08: 'iconst_5', 0x10: 'bipush', 0x11: 'sipush', 0x12: 'ldc',
    0x13: 'ldc_w', 0x15: 'iload', 0x19: 'aload', 0x1a: 'iload_0',
    0x1b: 'iload_1', 0x1c: 'iload_2', 0x1d: 'iload_3', 0x21: 'fload_3',
    0x2a: 'aload_0', 0x2b: 'aload_1', 0x2c: 'aload_2', 0x2d: 'aload_3',
    0x2e: 'iaload', 0x32: 'aaload', 0x33: 'baload', 0x34: 'caload',
    0x36: 'istore', 0x3a: 'astore', 0x3b: 'istore_0', 0x3c: 'istore_1',
    0x3d: 'istore_2', 0x3e: 'istore_3', 0x4b: 'astore_0', 0x4c: 'astore_1',
    0x4d: 'astore_2', 0x4e: 'astore_3', 0x4f: 'iastore', 0x53: 'aastore',
    0x57: 'pop', 0x59: 'dup', 0x5a: 'dup_x1', 0x60: 'iadd', 0x64: 'isub',
    0x68: 'imul', 0x6c: 'idiv', 0x6e: 'irem', 0x84: 'iinc', 0x99: 'ifeq',
    0x9a: 'ifne', 0x9b: 'iflt', 0x9c: 'ifge', 0x9d: 'ifgt', 0x9e: 'ifle',
    0x9f: 'if_icmpeq', 0xa0: 'if_icmpne', 0xa1: 'if_icmplt', 0xa2: 'if_icmpge',
    0xa3: 'if_icmpgt', 0xa4: 'if_icmple', 0xa7: 'goto', 0xb1: 'return',
    0xb2: 'getstatic', 0xb3: 'putstatic', 0xb4: 'getfield', 0xb5: 'putfield',
    0xb6: 'invokevirtual', 0xb7: 'invokespecial', 0xb8: 'invokestatic',
    0xbb: 'new', 0xbc: 'newarray', 0xbd: 'anewarray', 0xbe: 'arraylength'
}

def get_cp(data):
    magic, minor, major, cp_count = struct.unpack('>IHHH', data[:10])
    pos = 10
    cp = [None] * cp_count
    i = 1
    while i < cp_count:
        tag = data[pos]
        pos += 1
        if tag == 1:
            l, = struct.unpack('>H', data[pos:pos+2])
            pos += 2
            val = data[pos:pos+l].decode('utf-8', errors='replace')
            pos += l
            cp[i] = ('Utf8', val)
        elif tag == 3:
            val, = struct.unpack('>i', data[pos:pos+4])
            pos += 4
            cp[i] = ('Int', val)
        elif tag == 4:
            val, = struct.unpack('>f', data[pos:pos+4])
            pos += 4
            cp[i] = ('Float', val)
        elif tag in (5, 6):
            pos += 8
            cp[i] = ('Num',)
            i += 1
        elif tag == 7:
            n, = struct.unpack('>H', data[pos:pos+2])
            pos += 2
            cp[i] = ('Class', n)
        elif tag == 8:
            s, = struct.unpack('>H', data[pos:pos+2])
            pos += 2
            cp[i] = ('String', s)
        elif tag in (9, 10, 11):
            c, nt = struct.unpack('>HH', data[pos:pos+4])
            pos += 4
            cp[i] = ('Ref', c, nt)
        elif tag == 12:
            n, t = struct.unpack('>HH', data[pos:pos+4])
            pos += 4
            cp[i] = ('NameAndType', n, t)
        i += 1
    return cp, pos, data

def decompile(path):
    with open(path, 'rb') as f:
        data = f.read()
    cp, pos, data = get_cp(data)
    pos += 8
    ic, = struct.unpack('>H', data[pos-2:pos])
    pos += 2 * ic
    fc, = struct.unpack('>H', data[pos:pos+2])
    pos += 2
    for _ in range(fc):
        pos += 8
        ac, = struct.unpack('>H', data[pos-2:pos])
        for _ in range(ac):
            al, = struct.unpack('>I', data[pos+2:pos+6])
            pos += 6 + al
    mc, = struct.unpack('>H', data[pos:pos+2])
    pos += 2
    for _ in range(mc):
        ma, mn, md, ac = struct.unpack('>HHHH', data[pos:pos+8])
        pos += 8
        m_name = cp[mn][1]
        m_desc = cp[md][1]
        for _ in range(ac):
            an, al = struct.unpack('>HI', data[pos:pos+6])
            pos += 6
            if cp[an][1] == 'Code':
                ms, ml, cl = struct.unpack('>HHI', data[pos:pos+8])
                code = data[pos+8:pos+8+cl]
                print(f'=== METHOD {m_name}{m_desc} (code len {len(code)}) ===')
                idx = 0
                while idx < len(code):
                    op = code[idx]
                    opn = opnames.get(op, f'0x{op:02x}')
                    line = f'{idx:4d}: {opn}'
                    if op in (0x10, 0x15, 0x19, 0x36, 0x3a, 0xbc): # 1 byte arg
                        line += f' {code[idx+1]}'
                        idx += 2
                    elif op == 0x84: # iinc
                        line += f' {code[idx+1]} {code[idx+2]}'
                        idx += 3
                    elif op in (0x11, 0x99, 0x9a, 0x9b, 0x9c, 0x9d, 0x9e, 0x9f, 0xa0, 0xa1, 0xa2, 0xa3, 0xa4, 0xa7):
                        v, = struct.unpack('>h', code[idx+1:idx+3])
                        target = idx + v if op != 0x11 else v
                        line += f' {target} (rel {v})'
                        idx += 3
                    elif op in (0x12,):
                        cpi = code[idx+1]
                        cpe = cp[cpi]
                        if cpe[0] == 'String':
                            line += f' \"{cp[cpe[1]][1]}\"'
                        elif cpe[0] in ('Int', 'Float'):
                            line += f' {cpe[1]}'
                        else:
                            line += f' cp#{cpi} {cpe}'
                        idx += 2
                    elif op in (0x13, 0x14):
                        cpi, = struct.unpack('>H', code[idx+1:idx+3])
                        cpe = cp[cpi]
                        line += f' cp#{cpi} {cpe}'
                        idx += 3
                    elif op in (0xb2, 0xb3, 0xb4, 0xb5, 0xb6, 0xb7, 0xb8, 0xbb, 0xbd):
                        cpi, = struct.unpack('>H', code[idx+1:idx+3])
                        ref = cp[cpi]
                        if ref and ref[0] == 'Ref':
                            cls = cp[ref[1]]
                            cls_name = cp[cls[1]][1] if cls and cls[0] == 'Class' else '?'
                            nt = cp[ref[2]]
                            n = cp[nt[1]][1]
                            t = cp[nt[2]][1]
                            line += f' {cls_name}.{n}:{t}'
                        elif ref and ref[0] == 'Class':
                            line += f' class {cp[ref[1]][1]}'
                        else:
                            line += f' cp#{cpi} {ref}'
                        idx += 3
                    else:
                        idx += 1
                    print(line)
            pos += al

if __name__ == '__main__':
    decompile(sys.argv[1])
