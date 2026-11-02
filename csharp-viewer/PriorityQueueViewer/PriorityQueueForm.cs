using System;
using System.Drawing;
using System.Windows.Forms;

namespace PriorityQueueViewer
{
    public partial class PriorityQueueForm : Form
    {
        private PersonGroup personGroup;
        private bool isAnimating = false;

        public PriorityQueueForm()
        {
            InitializeComponent();
            personGroup = new PersonGroup();
            personGroup.DoFill();

            // Enable double buffering on canvasPanel to avoid flicker
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

        private void BtnNew_Click(object sender, EventArgs e)
        {
            if (isAnimating) return;
            personGroup.NewQueue();
            canvasPanel.Invalidate();

            if (personGroup.OpMode != 0)
            {
                StartAnimation();
            }
        }

        private void BtnIns_Click(object sender, EventArgs e)
        {
            if (isAnimating) return;

            bool isNumber = int.TryParse(txtNumber.Text.Trim(), out int val);
            personGroup.Insert(isNumber, isNumber ? val : -1);
            canvasPanel.Invalidate();

            if (personGroup.OpMode != 0)
            {
                StartAnimation();
            }
        }

        private void BtnRem_Click(object sender, EventArgs e)
        {
            if (isAnimating) return;

            string res = personGroup.Remove();
            if (!string.IsNullOrEmpty(res))
            {
                txtNumber.Text = res;
            }
            canvasPanel.Invalidate();

            if (personGroup.OpMode != 0)
            {
                StartAnimation();
            }
        }

        private void BtnPeek_Click(object sender, EventArgs e)
        {
            if (isAnimating) return;

            string res = personGroup.Peek();
            if (!string.IsNullOrEmpty(res))
            {
                txtNumber.Text = res;
            }
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
            if (personGroup.OpMode == 1)
            {
                personGroup.NewQueue();
            }
            else if (personGroup.OpMode == 2)
            {
                bool isNum = int.TryParse(txtNumber.Text.Trim(), out int val);
                personGroup.Insert(isNum, isNum ? val : -1);
            }
            else if (personGroup.OpMode == 3)
            {
                string res = personGroup.Remove();
                if (!string.IsNullOrEmpty(res))
                {
                    txtNumber.Text = res;
                }
            }
            else if (personGroup.OpMode == 4)
            {
                string res = personGroup.Peek();
                if (!string.IsNullOrEmpty(res))
                {
                    txtNumber.Text = res;
                }
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
