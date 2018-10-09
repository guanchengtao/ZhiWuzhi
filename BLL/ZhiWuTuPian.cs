using System;
using System.Data;
using System.Collections.Generic;
using Maticsoft.Common;
using SDAU.Model;
namespace SDAU.BLL
{
	/// <summary>
	/// ZhiWuTuPian
	/// </summary>
	public partial class ZhiWuTuPian
	{
		private readonly SDAU.DAL.ZhiWuTuPian dal=new SDAU.DAL.ZhiWuTuPian();
		public ZhiWuTuPian()
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
		public bool Exists(int TPBianHao)
		{
			return dal.Exists(TPBianHao);
		}

		/// <summary>
		/// 增加一条数据
		/// </summary>
		public int  Add(SDAU.Model.ZhiWuTuPian model)
		{
			return dal.Add(model);
		}

		/// <summary>
		/// 更新一条数据
		/// </summary>
		public bool Update(SDAU.Model.ZhiWuTuPian model)
		{
			return dal.Update(model);
		}

		/// <summary>
		/// 删除一条数据
		/// </summary>
		public bool Delete(int TPBianHao)
		{
			
			return dal.Delete(TPBianHao);
		}
        /// <summary>
        /// 
        /// </summary>
        /// <param name="TPBianHao"></param>
        /// <returns></returns>
        public bool DeleteByZhiwuId(int ZWBianHao)
        {

            return dal.DeleteByZhiwuId(ZWBianHao);
        }
        /// <summary>
        /// 删除一条数据
        /// </summary>
        public bool DeleteList(string TPBianHaolist )
		{
			return dal.DeleteList(TPBianHaolist );
		}

		/// <summary>
		/// 得到一个对象实体
		/// </summary>
		public SDAU.Model.ZhiWuTuPian GetModel(int TPBianHao)
		{
			
			return dal.GetModel(TPBianHao);
		}
    
        /// <summary>
        /// 得到一个对象实体，从缓存中
        /// </summary>
        public SDAU.Model.ZhiWuTuPian GetModelByCache(int TPBianHao)
		{
			
			string CacheKey = "ZhiWuTuPianModel-" + TPBianHao;
			object objModel = Maticsoft.Common.DataCache.GetCache(CacheKey);
			if (objModel == null)
			{
				try
				{
					objModel = dal.GetModel(TPBianHao);
					if (objModel != null)
					{
						int ModelCache = Maticsoft.Common.ConfigHelper.GetConfigInt("ModelCache");
						Maticsoft.Common.DataCache.SetCache(CacheKey, objModel, DateTime.Now.AddMinutes(ModelCache), TimeSpan.Zero);
					}
				}
				catch{}
			}
			return (SDAU.Model.ZhiWuTuPian)objModel;
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
		public List<SDAU.Model.ZhiWuTuPian> GetModelList(string strWhere)
		{
			DataSet ds = dal.GetList(strWhere);
			return DataTableToList(ds.Tables[0]);
		}

        /// <summary>
        /// 获得数据列表
        /// </summary>
        public List<SDAU.Model.ZhiWuTuPian> DataTableToList(DataTable dt)
		{
			List<SDAU.Model.ZhiWuTuPian> modelList = new List<SDAU.Model.ZhiWuTuPian>();
			int rowsCount = dt.Rows.Count;
			if (rowsCount > 0)
			{
				SDAU.Model.ZhiWuTuPian model;
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

