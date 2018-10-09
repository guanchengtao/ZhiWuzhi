using System;
namespace Maticsoft.Model
{
	
	/// <summary>
	/// 树节点
	/// </summary>
	[Serializable]
	public class SysNode
	{
		private int _nodeid;
		private string _text;
		private int _parentid;
		private string _location;
		private int _orderid;
		private string _comment;
		private string _url;
		private int _permissionid;
		private string _imageurl;
		private int _moduleid;
		private int _Keshidm;
		private string _Keshipublic;
		public SysNode()
		{			
		}
		public int NodeID
		{
			set{ _nodeid=value;}
			get{return _nodeid;}
		}

		public string Text
		{
			set{ _text=value;}
			get{return _text;}
		}
		public int ParentID
		{
			set{ _parentid=value;}
			get{return _parentid;}
		}
		public string Location
		{
			set{ _location=value;}
			get{return _location;}
		}
		public int OrderID
		{
			set{ _orderid=value;}
			get{return _orderid;}
		}
		public string Comment
		{
			set{ _comment=value;}
			get{return _comment;}
		}
		public string Url
		{
			set{ _url=value;}
			get{return _url;}
		}
		public int PermissionID
		{
			set{ _permissionid=value;}
			get{return _permissionid;}
		}
		public string ImageUrl
		{
			set{ _imageurl=value;}
			get{return _imageurl;}
		}
		public int ModuleID
		{
			set{_moduleid=value;}
			get{return _moduleid;}
		}

		public int KeShiDM
		{
			set{_Keshidm=value;}
			get{return _Keshidm;}
		}
		public string KeshiPublic
		{
			set{ _Keshipublic=value;}
			get{return _Keshipublic;}
		}

	}
}
