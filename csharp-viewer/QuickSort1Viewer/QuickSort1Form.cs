using System;
using System.Drawing;
using System.Windows.Forms;

namespace QuickSort1Viewer;

public partial class QuickSort1Form : Form
{
    private PersonGroup _group;
    private readonly System.Windows.Forms.Timer _timer;
    private bool _isRunning;

    public QuickSort1Form()
    {
        InitializeComponent();
        _group = new PersonGroup(10, 1);

        _timer = new System.Windows.Forms.Timer();
        _timer.Interval = 250;
        _timer.Tick += (s, e) =>
        {
            if (_group.DoneFlag)
            {
                _isRunning = false;
                _timer.Stop();
                btnRun.Text = "Run";
            }
            else
            {
                _group.SortStep();
            }
            canvasPanel.Invalidate();
        };

        canvasPanel.Paint += (s, e) => _group.Draw(e.Graphics);
    }

    private void btnNew_Click(object sender, EventArgs e)
    {
        int newOrder = _group.InitOrder == 1 ? 2 : 1;
        _group.Init(_group.ASize, newOrder);
        canvasPanel.Invalidate();
    }

    private void btnSize_Click(object sender, EventArgs e)
    {
        int newSize = _group.ASize == 10 ? 100 : 10;
        _group.Init(newSize, _group.InitOrder);
        canvasPanel.Invalidate();
    }

    private void btnDraw_Click(object sender, EventArgs e)
    {
        canvasPanel.Invalidate();
    }

    private void btnRun_Click(object sender, EventArgs e)
    {
        if (_group.DoneFlag) return;
        _isRunning = !_isRunning;
        if (_isRunning)
        {
            btnRun.Text = "Pause";
            _timer.Start();
        }
        else
        {
            btnRun.Text = "Run";
            _timer.Stop();
        }
    }

    private void btnStep_Click(object sender, EventArgs e)
    {
        if (_isRunning)
        {
            _isRunning = false;
            _timer.Stop();
            btnRun.Text = "Run";
        }
        _group.SortStep();
        canvasPanel.Invalidate();
    }
}
