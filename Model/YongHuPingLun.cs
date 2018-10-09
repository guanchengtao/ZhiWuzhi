using System;
namespace SDAU.Model
{
	/// <summary>
	/// YongHuPingLun:实体类(属性说明自动提取数据库字段的描述信息)
	/// </summary>
	[Serializable]
	public partial class YongHuPingLun
	{
		public YongHuPingLun()
		{}
		#region Model
		private int _plbianhao;
		private int _zwbianhao;
		private int _yhbianhao;
		private string _neirong;
		private DateTime _plshijian;
		private string _beizhu;
		/// <summary>
		/// 
		/// </summary>
		public int PLBianHao
		{
			set{ _plbianhao=value;}
			get{return _plbianhao;}
		}
		/// <summary>
		/// 
		/// </summary>
		public int ZWBianHao
		{
			set{ _zwbianhao=value;}
			get{return _zwbianhao;}
		}
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
		public string NeiRong
		{
			set{ _neirong=value;}
			get{return _neirong;}
		}
		/// <summary>
		/// 
		/// </summary>
		public DateTime PLShiJian
		{
			set{ _plshijian=value;}
			get{return _plshijian;}
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

