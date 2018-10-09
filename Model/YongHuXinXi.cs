using System;
namespace SDAU.Model
{
	/// <summary>
	/// YongHuXinXi:实体类(属性说明自动提取数据库字段的描述信息)
	/// </summary>
	[Serializable]
	public partial class YongHuXinXi
	{
		public YongHuXinXi()
		{}
		#region Model
		private int _yhbianhao;
		private string _yonghuming;
		private string _yonghumima;
		private string _youxiang;
		private DateTime _zhuceshijian;
		private int _quanxian;
		private byte[] _touxiang;
		private string _beizhu;
		/// <summary>
		/// 
		/// </summary>
		public int YHBianHao
		{
			set{ _yhbianhao=value;}
			get{return _yhbianhao;}
		}
		/// <summary>
		/// 
		/// </summary>
		public string YongHuMing
		{
			set{ _yonghuming=value;}
			get{return _yonghuming;}
		}
		/// <summary>
		/// 
		/// </summary>
		public string YongHuMiMa
		{
			set{ _yonghumima=value;}
			get{return _yonghumima;}
		}
		/// <summary>
		/// 
		/// </summary>
		public string YouXiang
		{
			set{ _youxiang=value;}
			get{return _youxiang;}
		}
		/// <summary>
		/// 
		/// </summary>
		public DateTime ZhuCeShiJian
		{
			set{ _zhuceshijian=value;}
			get{return _zhuceshijian;}
		}
		/// <summary>
		/// 
		/// </summary>
		public int QuanXian
		{
			set{ _quanxian=value;}
			get{return _quanxian;}
		}
		/// <summary>
		/// 
		/// </summary>
		public byte[] TouXiang
		{
			set{ _touxiang=value;}
			get{return _touxiang;}
		}
		/// <summary>
		/// 
		/// </summary>
		public string BeiZhu
		{
			set{ _beizhu=value;}
			get{return _beizhu;}
		}
		#endregion Model

	}
}

