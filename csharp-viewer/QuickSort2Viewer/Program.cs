using System;
using System.Windows.Forms;

namespace QuickSort2Viewer
{
    internal static class Program
    {
        [STAThread]
        static void Main()
        {
            ApplicationConfiguration.Initialize();
            Application.Run(new QuickSort2Form());
        }
    }
}
