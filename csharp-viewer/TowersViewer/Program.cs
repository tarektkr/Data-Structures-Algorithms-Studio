using System;
using System.Windows.Forms;

namespace TowersViewer
{
    internal static class Program
    {
        [STAThread]
        static void Main()
        {
            ApplicationConfiguration.Initialize();
            Application.Run(new TowersForm());
        }
    }
}
