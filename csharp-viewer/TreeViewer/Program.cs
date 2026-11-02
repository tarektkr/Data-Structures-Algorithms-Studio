using System;
using System.Windows.Forms;

namespace TreeViewer
{
    internal static class Program
    {
        [STAThread]
        static void Main()
        {
            ApplicationConfiguration.Initialize();
            Application.Run(new TreeForm());
        }
    }
}
