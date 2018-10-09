using System;
using System.Data;
using System.Collections.Generic;
using Maticsoft.Common;
using SDAU.Model;
namespace SDAU.BLL
{
	/// <summary>
	/// ZhiWuXinXi
	/// </summary>
	public partial class ZhiWuXinXi
	{
		private readonly SDAU.DAL.ZhiWuXinXi dal=new SDAU.DAL.ZhiWuXinXi();
		public ZhiWuXinXi()
		{}
		#region  BasicMethod

		/// <summary>
		/// 得到最大ID
		/// </summary>
		public int GetMaxId()
		{
			return dal.GetMaxId();
		}

		/// <summary>
		/// 是否存在该记录
		/// </summary>
		public bool Exists(int ZWBianHao)
		{
			return dal.Exists(ZWBianHao);
		}

		/// <summary>
		/// 增加一条数据
		/// </summary>
		public int  Add(SDAU.Model.ZhiWuXinXi model)
		{
			return dal.Add(model);
		}

		/// <summary>
		/// 更新一条数据
		/// </summary>
		public bool Update(SDAU.Model.ZhiWuXinXi model)
		{
			return dal.Update(model);
		}

		/// <summary>
		/// 删除一条数据
		/// </summary>
		public bool Delete(int ZWBianHao)
		{
			
			return dal.Delete(ZWBianHao);
		}
      
        /// <summary>
        /// 删除一条数据
        /// </summary>
        public bool DeleteList(string ZWBianHaolist )
		{
			return dal.DeleteList(ZWBianHaolist );
		}

		/// <summary>
		/// 得到一个对象实体
		/// </summary>
		public SDAU.Model.ZhiWuXinXi GetModel(int ZWBianHao)
		{
			
			return dal.GetModel(ZWBianHao);
		}

		/// <summary>
		/// 得到一个对象实体，从缓存中
		/// </summary>
		public SDAU.Model.ZhiWuXinXi GetModelByCache(int ZWBianHao)
		{
			
			string CacheKey = "ZhiWuXinXiModel-" + ZWBianHao;
			object objModel = Maticsoft.Common.DataCache.GetCache(CacheKey);
			if (objModel == null)
			{
				try
				{
					objModel = dal.GetModel(ZWBianHao);
					if (objModel != null)
					{
						int ModelCache = Maticsoft.Common.ConfigHelper.GetConfigInt("ModelCache");
						Maticsoft.Common.DataCache.SetCache(CacheKey, objModel, DateTime.Now.AddMinutes(ModelCache), TimeSpan.Zero);
					}
				}
				catch{}
			}
			return (SDAU.Model.ZhiWuXinXi)objModel;
		}

		/// <summary>
		/// 获得数据列表
		/// </summary>
		public DataSet GetList(string strWhere)
		{
			return dal.GetList(strWhere);
		}
		/// <summary>
		/// 获得前几行数据
		/// </summary>
		public DataSet GetList(int Top,string strWhere,string filedOrder)
		{
			return dal.GetList(Top,strWhere,filedOrder);
		}
		/// <summary>
		/// 获得数据列表
		/// </summary>
		public List<SDAU.Model.ZhiWuXinXi> GetModelList(string strWhere)
		{
			DataSet ds = dal.GetList(strWhere);
			return DataTableToList(ds.Tables[0]);
		}
		/// <summary>
		/// 获得数据列表
		/// </summary>
		public List<SDAU.Model.ZhiWuXinXi> DataTableToList(DataTable dt)
		{
			List<SDAU.Model.ZhiWuXinXi> modelList = new List<SDAU.Model.ZhiWuXinXi>();
			int rowsCount = dt.Rows.Count;
			if (rowsCount > 0)
			{
				SDAU.Model.ZhiWuXinXi model;
				for (int n = 0; n < rowsCount; n++)
				{
					model = dal.DataRowToModel(dt.Rows[n]);
					if (model != null)
					{
						modelList.Add(model);
					}
				}
			}
			return modelList;
		}

		/// <summary>
		/// 获得数据列表
		/// </summary>
		public DataSet GetAllList()
		{
			return GetList("");
		}

		/// <summary>
		/// 分页获取数据列表
		/// </summary>
		public int GetRecordCount(string strWhere)
		{
			return dal.GetRecordCount(strWhere);
		}
		/// <summary>
		/// 分页获取数据列表
		/// </summary>
		public DataSet GetListByPage(string strWhere, string orderby, int startIndex, int endIndex)
		{
			return dal.GetListByPage( strWhere,  orderby,  startIndex,  endIndex);
		}
		/// <summary>
		/// 分页获取数据列表
		/// </summary>
		//public DataSet GetList(int PageSize,int PageIndex,string strWhere)
		//{
			//return dal.GetList(PageSize,PageIndex,strWhere);
		//}

		#endregion  BasicMethod
		#region  ExtensionMethod

		#endregion  ExtensionMethod
	}
}

