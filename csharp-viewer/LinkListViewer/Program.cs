using System;
using System.Windows.Forms;

namespace LinkListViewer
{
    internal static class Program
    {
        [STAThread]
        static void Main()
        {
            ApplicationConfiguration.Initialize();
            Application.Run(new LinkListForm());
        }
    }
}
