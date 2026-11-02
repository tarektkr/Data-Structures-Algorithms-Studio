using System;
using System.Windows.Forms;

namespace PriorityQueueViewer
{
    internal static class Program
    {
        [STAThread]
        static void Main()
        {
            ApplicationConfiguration.Initialize();
            Application.Run(new PriorityQueueForm());
        }
    }
}
