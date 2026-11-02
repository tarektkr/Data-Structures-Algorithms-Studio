using System;
using System.Windows.Forms;

namespace HashViewer
{
    internal static class Program
    {
        /// <summary>
        /// The main entry point for the Linear-Probe Hash Table application.
        /// </summary>
        [STAThread]
        static void Main()
        {
            ApplicationConfiguration.Initialize();
            Application.Run(new HashForm());
        }
    }
}
