using System;
using System.Drawing;
using System.Windows.Forms;

namespace LinkListViewer
{
    public partial class LinkListForm : Form
    {
        private PersonGroup personGroup;
        private bool isAnimating = false;

        public LinkListForm()
        {
            InitializeComponent();
            personGroup = new PersonGroup();
            personGroup.DoFill(10);

            // DoubleBuffering لمنع الوميض
            typeof(Panel).InvokeMember("DoubleBuffered",
                System.Reflection.BindingFlags.SetProperty |
                System.Reflection.BindingFlags.Instance |
                System.Reflection.BindingFlags.NonPublic,
                null, canvasPanel, new object[] { true });
        }

        private void CanvasPanel_Paint(object sender, PaintEventArgs e)
        {
            personGroup.Draw(e.Graphics);
        }

        private void RbSort_CheckedChanged(object sender, EventArgs e)
        {
            if (rbUnsorted.Checked)
            {
                personGroup.SetSortStatus(true);
            }
            else if (rbSorted.Checked)
            {
                personGroup.SetSortStatus(false);
            }
            canvasPanel.Invalidate();
        }

        private void BtnNew_Click(object sender, EventArgs e)
        {
            if (isAnimating) return;
            bool isNum = int.TryParse(txtNumber.Text.Trim(), out int val);
            personGroup.NewList(isNum, isNum ? val : 10);
            canvasPanel.Invalidate();

            if (personGroup.OpMode != 0)
            {
                StartAnimation();
            }
        }

        private void BtnIns_Click(object sender, EventArgs e)
        {
            if (isAnimating) return;
            bool isNum = int.TryParse(txtNumber.Text.Trim(), out int val);
            personGroup.Insert(isNum, isNum ? val : -1);
            canvasPanel.Invalidate();

            if (personGroup.OpMode != 0)
            {
                StartAnimation();
            }
        }

        private void BtnFind_Click(object sender, EventArgs e)
        {
            if (isAnimating) return;
            bool isNum = int.TryParse(txtNumber.Text.Trim(), out int val);
            personGroup.Find(isNum, isNum ? val : -1);
            canvasPanel.Invalidate();

            if (personGroup.OpMode != 0)
            {
                StartAnimation();
            }
        }

        private void BtnDel_Click(object sender, EventArgs e)
        {
            if (isAnimating) return;
            bool isNum = int.TryParse(txtNumber.Text.Trim(), out int val);
            personGroup.Delete(isNum, isNum ? val : -1);
            canvasPanel.Invalidate();

            if (personGroup.OpMode != 0)
            {
                StartAnimation();
            }
        }

        private void StartAnimation()
        {
            isAnimating = true;
            animationTimer.Start();
        }

        private void AnimationTimer_Tick(object sender, EventArgs e)
        {
            bool isNum = int.TryParse(txtNumber.Text.Trim(), out int val);

            if (personGroup.OpMode == 1)
            {
                personGroup.NewList(isNum, isNum ? val : 10);
            }
            else if (personGroup.OpMode == 2)
            {
                personGroup.Insert(isNum, isNum ? val : -1);
            }
            else if (personGroup.OpMode == 3)
            {
                personGroup.Find(isNum, isNum ? val : -1);
            }
            else if (personGroup.OpMode == 4)
            {
                personGroup.Delete(isNum, isNum ? val : -1);
            }

            canvasPanel.Invalidate();

            if (personGroup.OpMode == 0)
            {
                animationTimer.Stop();
                isAnimating = false;
            }
        }
    }
}
