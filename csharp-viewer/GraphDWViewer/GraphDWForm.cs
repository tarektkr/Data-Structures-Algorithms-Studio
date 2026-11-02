using System;
using System.Drawing;
using System.Windows.Forms;

namespace GraphDWViewer
{
    public partial class GraphDWForm : Form
    {
        private VertexGroup theVertexGroup;
        private bool wasClearPressed;
        private int gpNumber;
        private bool isNumber;

        public GraphDWForm()
        {
            InitializeComponent();
            DoubleBuffered = true;
            theVertexGroup = new VertexGroup();
            wasClearPressed = false;
            gpNumber = -1;
            isNumber = false;
        }

        private void BtnNew_Click(object sender, EventArgs e)
        {
            if (wasClearPressed)
            {
                wasClearPressed = false;
                theVertexGroup = new VertexGroup();
            }
            else
            {
                wasClearPressed = true;
                theVertexGroup.WarningNew();
            }
            canvasPanel.Invalidate();
        }

        private void BtnPath_Click(object sender, EventArgs e)
        {
            wasClearPressed = false;
            theVertexGroup.Path();
            canvasPanel.Invalidate();
        }

        private void BtnView_Click(object sender, EventArgs e)
        {
            wasClearPressed = false;
            theVertexGroup.ChangeView();
            canvasPanel.Invalidate();
        }

        private void BtnSample_Click(object sender, EventArgs e)
        {
            wasClearPressed = false;
            theVertexGroup = new VertexGroup();

            theVertexGroup.MakeVertex(60, 150);  // A
            theVertexGroup.MakeVertex(160, 100); // B
            theVertexGroup.MakeVertex(280, 100); // C
            theVertexGroup.MakeVertex(370, 160); // D
            theVertexGroup.MakeVertex(210, 220); // E

            theVertexGroup.AdjMat[0, 1].Distance = 50; // A -> B
            theVertexGroup.AdjMat[0, 3].Distance = 80; // A -> D
            theVertexGroup.AdjMat[1, 2].Distance = 60; // B -> C
            theVertexGroup.AdjMat[1, 3].Distance = 90; // B -> D
            theVertexGroup.AdjMat[2, 3].Distance = 40; // C -> D
            theVertexGroup.AdjMat[3, 4].Distance = 20; // D -> E
            theVertexGroup.AdjMat[4, 1].Distance = 50; // E -> B
            theVertexGroup.AdjMat[4, 2].Distance = 30; // E -> C

            theVertexGroup.Note = "Sample graph loaded. Click Path then click vertex A to start!";
            theVertexGroup.MadeVertex = false;
            canvasPanel.Invalidate();
        }

        private void CanvasPanel_Paint(object sender, PaintEventArgs e)
        {
            theVertexGroup.Draw(e.Graphics);
        }

        private void CanvasPanel_MouseDown(object sender, MouseEventArgs e)
        {
            wasClearPressed = false;
            theVertexGroup.StartDrag(e.X, e.Y);
            canvasPanel.Invalidate();
        }

        private void CanvasPanel_MouseDoubleClick(object sender, MouseEventArgs e)
        {
            theVertexGroup.MakeVertex(e.X, e.Y);
            canvasPanel.Invalidate();
        }

        private void CanvasPanel_MouseUp(object sender, MouseEventArgs e)
        {
            string txt = txtNumber.Text.Trim();
            if (int.TryParse(txt, out int val))
            {
                isNumber = true;
                gpNumber = val;
            }
            else
            {
                isNumber = false;
            }

            theVertexGroup.EndDrag(isNumber, gpNumber, e.X, e.Y);
            isNumber = false;
            txtNumber.Text = "";
            canvasPanel.Invalidate();
        }
    }
}
