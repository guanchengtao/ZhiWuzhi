using System;
using System.Runtime.InteropServices;
using System.Text;
using System.IO;

namespace Maticsoft.Common
{
    /// <summary>
    /// INI文件读写类。
    /// Copyright (C) Maticsoft
    /// </summary>
	public class INIFile
	{
		public string path;

		public INIFile(string INIPath)
		{
			path = INIPath;
		}

		[DllImport("Kernel32")]
		private static extern long WritePrivateProfileString(string section,string Key,string val,string filePath);

		[DllImport("Kernel32")]
		private static extern int GetPrivateProfileString(string section,string Key,string def, StringBuilder retVal,int size,string filePath);

	
		[DllImport("Kernel32")]
		private static extern int GetPrivateProfileString(string section, string Key, string defVal, Byte[] retVal, int size, string filePath);


		/// <summary>
		/// 写INI文件
		/// </summary>
		/// <param name="Section"></param>
		/// <param name="Key"></param>
		/// <param name="Value"></param>
		public void IniWriteValue(string Section,string Key,string Value)
		{
			WritePrivateProfileString(Section,Key,Value,this.path);
		}

		/// <summary>
		/// 读取INI文件
		/// </summary>
		/// <param name="Section"></param>
		/// <param name="Key"></param>
		/// <returns></returns>
		public string IniReadValue(string Section,string Key)
		{
			StringBuilder temp = new StringBuilder(255);
			int i = GetPrivateProfileString(Section,Key,"",temp, 255, this.path);
			return temp.ToString();
		}
		public byte[] IniReadValues(string section, string Key)
		{
			byte[] temp = new byte[255];
			int i = GetPrivateProfileString(section, Key, "", temp, 255, this.path);
			return temp;

		}


		/// <summary>
		/// 删除ini文件下所有段落
		/// </summary>
		public void ClearAllSection()
		{
			IniWriteValue(null,null,null);
		}
		/// <summary>
		/// 删除ini文件下personal段落下的所有键
		/// </summary>
		/// <param name="Section"></param>
		public void ClearSection(string Section)
		{
			IniWriteValue(Section,null,null);
		}

	}


}
