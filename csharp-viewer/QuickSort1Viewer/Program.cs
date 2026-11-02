using System;
using System.Windows.Forms;

namespace QuickSort1Viewer;

internal static class Program
{
    [STAThread]
    static void Main()
    {
        ApplicationConfiguration.Initialize();
        Application.Run(new QuickSort1Form());
    }
}
