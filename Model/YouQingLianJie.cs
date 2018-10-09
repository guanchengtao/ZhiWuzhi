using System;
namespace SDAU.Model
{
	/// <summary>
	/// YouQingLianJie:实体类(属性说明自动提取数据库字段的描述信息)
	/// </summary>
	[Serializable]
	public partial class YouQingLianJie
	{
		public YouQingLianJie()
		{}
		#region Model
		private int _wzbianhao;
		private string _wzmingcheng;
		private string _dizhi;
		private string _beizhu;
		/// <summary>
		/// 
		/// </summary>
		public int WZBianHao
		{
			set{ _wzbianhao=value;}
			get{return _wzbianhao;}
		}
		/// <summary>
		/// 
		/// </summary>
		public string WZMingCheng
		{
			set{ _wzmingcheng=value;}
			get{return _wzmingcheng;}
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

