using System;
using System.Data;
using System.Collections.Generic;
using Maticsoft.Common;
using SDAU.Model;
namespace SDAU.BLL
{
	/// <summary>
	/// YongHuXinXi
	/// </summary>
	public partial class YongHuXinXi
	{
		private readonly SDAU.DAL.YongHuXinXi dal=new SDAU.DAL.YongHuXinXi();
		public YongHuXinXi()
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
		public bool Exists(int YHBianHao)
		{
			return dal.Exists(YHBianHao);
		}

        public bool userExists(string name, string pwd)
        {
            return dal.userExists(name,pwd);
        }
        public bool userZguceExists(string name)
        {
            return dal.userZhuceExists(name);
        }

        /// <summary>
        /// 增加一条数据
        /// </summary>
        public int  Add(SDAU.Model.YongHuXinXi model)
		{
			return dal.Add(model);
		}

		/// <summary>
		/// 更新一条数据
		/// </summary>
		public bool Update(SDAU.Model.YongHuXinXi model)
		{
			return dal.Update(model);
		}

		/// <summary>
		/// 删除一条数据
		/// </summary>
		public bool Delete(int YHBianHao)
		{
			
			return dal.Delete(YHBianHao);
		}
		/// <summary>
		/// 删除一条数据
		/// </summary>
		public bool DeleteList(string YHBianHaolist )
		{
			return dal.DeleteList(YHBianHaolist );
		}

		/// <summary>
		/// 得到一个对象实体
		/// </summary>
		public SDAU.Model.YongHuXinXi GetModel(int YHBianHao)
		{
			
			return dal.GetModel(YHBianHao);
		}

        public SDAU.Model.YongHuXinXi GetModel(string name)
        {

            return dal.GetModel(name);
        }
        /// <summary>
        /// 得到一个对象实体，从缓存中
        /// </summary>
        public SDAU.Model.YongHuXinXi GetModelByCache(int YHBianHao)
		{
			
			string CacheKey = "YongHuXinXiModel-" + YHBianHao;
			object objModel = Maticsoft.Common.DataCache.GetCache(CacheKey);
			if (objModel == null)
			{
				try
				{
					objModel = dal.GetModel(YHBianHao);
					if (objModel != null)
					{
						int ModelCache = Maticsoft.Common.ConfigHelper.GetConfigInt("ModelCache");
						Maticsoft.Common.DataCache.SetCache(CacheKey, objModel, DateTime.Now.AddMinutes(ModelCache), TimeSpan.Zero);
					}
				}
				catch{}
			}
			return (SDAU.Model.YongHuXinXi)objModel;
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
		public List<SDAU.Model.YongHuXinXi> GetModelList(string strWhere)
		{
			DataSet ds = dal.GetList(strWhere);
			return DataTableToList(ds.Tables[0]);
		}
		/// <summary>
		/// 获得数据列表
		/// </summary>
		public List<SDAU.Model.YongHuXinXi> DataTableToList(DataTable dt)
		{
			List<SDAU.Model.YongHuXinXi> modelList = new List<SDAU.Model.YongHuXinXi>();
			int rowsCount = dt.Rows.Count;
			if (rowsCount > 0)
			{
				SDAU.Model.YongHuXinXi model;
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
        public List<Model.YongHuXinXi> LoadPageData(int pageIndex, int pageSize, out int total)
        {
            return dal.LoadPageData(pageIndex, pageSize, out total);


        }
        #endregion  ExtensionMethod
    }
}

