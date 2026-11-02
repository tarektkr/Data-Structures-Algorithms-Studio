using System;
using System.Windows.Forms;

namespace OrderedArrayViewer
{
    internal static class Program
    {
        [STAThread]
        static void Main()
        {
            ApplicationConfiguration.Initialize();
            Application.Run(new OrderedForm());
        }
    }
}
