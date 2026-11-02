using System;
using System.Windows.Forms;

namespace RobertLafore_DSA_Studio
{
    internal static class Program
    {
        /// <summary>
        /// نقطة الدخول الرئيسية للتطبيق الموحد (Main Entry Point)
        /// تشغل نافذة التحكم المركزية MainDashboardForm التي تضم جميع الفصول الـ 19
        /// </summary>
        [STAThread]
        static void Main()
        {
            ApplicationConfiguration.Initialize();
            Application.Run(new MainDashboardForm());
        }
    }
}
