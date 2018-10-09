using System;
namespace SDAU.Model
{
	/// <summary>
	/// ZhiWuTuPian:实体类(属性说明自动提取数据库字段的描述信息)
	/// </summary>
	[Serializable]
	public partial class ZhiWuTuPian
	{
		public ZhiWuTuPian()
		{}
		#region Model
		private int _tpbianhao;
		private int _zwbianhao;
		private byte[] _tupian;
		private string _dizhi;
		private string _beizhu;
		/// <summary>
		/// 
		/// </summary>
		public int TPBianHao
		{
			set{ _tpbianhao=value;}
			get{return _tpbianhao;}
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
		public byte[] TuPian
		{
			set{ _tupian=value;}
			get{return _tupian;}
		}
		/// <summary>
		/// 
		/// </summary>
		public string DiZhi
		{
			set{ _dizhi=value;}
			get{return _dizhi;}
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

