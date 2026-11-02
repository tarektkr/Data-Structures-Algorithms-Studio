using System;
using System.Windows.Forms;

namespace HashChainViewer
{
    internal static class Program
    {
        /// <summary>
        /// نقطة الدخول الرئيسية للتطبيق (Main Entry Point).
        /// </summary>
        [STAThread]
        static void Main()
        {
            ApplicationConfiguration.Initialize();
            Application.Run(new HashChainForm());
        }
    }
}
