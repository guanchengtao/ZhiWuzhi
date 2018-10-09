using System;
using System.Data;
using System.Collections.Generic;
using Maticsoft.Common;
using SDAU.Model;
namespace SDAU.BLL
{
	/// <summary>
	/// YongHuPingLun
	/// </summary>
	public partial class YongHuPingLun
	{
		private readonly SDAU.DAL.YongHuPingLun dal=new SDAU.DAL.YongHuPingLun();
		public YongHuPingLun()
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
		public bool Exists(int PLBianHao)
		{
			return dal.Exists(PLBianHao);
		}

		/// <summary>
		/// 增加一条数据
		/// </summary>
		public int  Add(SDAU.Model.YongHuPingLun model)
		{
			return dal.Add(model);
		}

		/// <summary>
		/// 更新一条数据
		/// </summary>
		public bool Update(SDAU.Model.YongHuPingLun model)
		{
			return dal.Update(model);
		}

		/// <summary>
		/// 删除一条数据
		/// </summary>
		public bool Delete(int PLBianHao)
		{
			
			return dal.Delete(PLBianHao);
		}
        /// <summary>
        /// 删除一条数据
        /// </summary>
        public bool DeleteByZhiwuId(int ZwBianHao)
        {

            return dal.DeleteByZhiwuId(ZwBianHao);
        }

        public bool DeleteList(string ZWBianHaolist )
		{
			return dal.DeleteList(ZWBianHaolist );
		}

		/// <summary>
		/// 得到一个对象实体
		/// </summary>
		public SDAU.Model.YongHuPingLun GetModel(int ZWBianHao)
		{
			
			return dal.GetModel(ZWBianHao);
		}

		/// <summary>
		/// 得到一个对象实体，从缓存中
		/// </summary>
		public SDAU.Model.YongHuPingLun GetModelByCache(int ZWBianHao)
		{
			
			string CacheKey = "YongHuPingLunModel-" + ZWBianHao;
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
			return (SDAU.Model.YongHuPingLun)objModel;
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
		public List<SDAU.Model.YongHuPingLun> GetModelList(string strWhere)
		{
			DataSet ds = dal.GetList(strWhere);
			return DataTableToList(ds.Tables[0]);
		}
		/// <summary>
		/// 获得数据列表
		/// </summary>
		public List<SDAU.Model.YongHuPingLun> DataTableToList(DataTable dt)
		{
			List<SDAU.Model.YongHuPingLun> modelList = new List<SDAU.Model.YongHuPingLun>();
			int rowsCount = dt.Rows.Count;
			if (rowsCount > 0)
			{
				SDAU.Model.YongHuPingLun model;
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

