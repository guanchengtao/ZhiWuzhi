using System;
using System.Data;
using System.Text;
using System.Data.SqlClient;
using Maticsoft.DBUtility;//Please add references
namespace SDAU.DAL
{
	/// <summary>
	/// 数据访问类:ZhiWuTuPian
	/// </summary>
	public partial class ZhiWuTuPian
	{
		public ZhiWuTuPian()
		{}
		#region  BasicMethod

		/// <summary>
		/// 得到最大ID
		/// </summary>
		public int GetMaxId()
		{
		return DbHelperSQL.GetMaxID("TPBianHao", "ZhiWuTuPian"); 
		}

		/// <summary>
		/// 是否存在该记录
		/// </summary>
		public bool Exists(int TPBianHao)
		{
			StringBuilder strSql=new StringBuilder();
			strSql.Append("select count(1) from ZhiWuTuPian");
			strSql.Append(" where TPBianHao=@TPBianHao");
			SqlParameter[] parameters = {
					new SqlParameter("@TPBianHao", SqlDbType.Int,4)
			};
			parameters[0].Value = TPBianHao;

			return DbHelperSQL.Exists(strSql.ToString(),parameters);
		}


		/// <summary>
		/// 增加一条数据
		/// </summary>
		public int Add(SDAU.Model.ZhiWuTuPian model)
		{
			StringBuilder strSql=new StringBuilder();
			strSql.Append("insert into ZhiWuTuPian(");
			strSql.Append("ZWBianHao,DiZhi,BeiZhu)");
			strSql.Append(" values (");
			strSql.Append("@ZWBianHao,@DiZhi,@BeiZhu)");
			strSql.Append(";select @@IDENTITY");
			SqlParameter[] parameters = {
					new SqlParameter("@ZWBianHao", SqlDbType.Int,4),
					new SqlParameter("@DiZhi", SqlDbType.NVarChar,200),
					new SqlParameter("@BeiZhu", SqlDbType.NVarChar,50)};
			parameters[0].Value = model.ZWBianHao;
			parameters[1].Value = model.DiZhi;
			parameters[2].Value = model.BeiZhu;

			object obj = DbHelperSQL.GetSingle(strSql.ToString(),parameters);
			if (obj == null)
			{
				return 0;
			}
			else
			{
				return Convert.ToInt32(obj);
			}
		}
		/// <summary>
		/// 更新一条数据
		/// </summary>
		public bool Update(SDAU.Model.ZhiWuTuPian model)
		{
			StringBuilder strSql=new StringBuilder();
			strSql.Append("update ZhiWuTuPian set ");
			strSql.Append("ZWBianHao=@ZWBianHao,");
			strSql.Append("DiZhi=@DiZhi,");
			strSql.Append("BeiZhu=@BeiZhu");
			strSql.Append(" where TPBianHao=@TPBianHao");
			SqlParameter[] parameters = {
					new SqlParameter("@ZWBianHao", SqlDbType.Int,4),
					new SqlParameter("@DiZhi", SqlDbType.NVarChar,200),
					new SqlParameter("@BeiZhu", SqlDbType.NVarChar,50),
					new SqlParameter("@TPBianHao", SqlDbType.Int,4)};
			parameters[0].Value = model.ZWBianHao;
			parameters[1].Value = model.DiZhi;
			parameters[2].Value = model.BeiZhu;
			parameters[3].Value = model.TPBianHao;

			int rows=DbHelperSQL.ExecuteSql(strSql.ToString(),parameters);
			if (rows > 0)
			{
				return true;
			}
			else
			{
				return false;
			}
		}

		/// <summary>
		/// 删除一条数据
		/// </summary>
		public bool Delete(int TPBianHao)
		{
			
			StringBuilder strSql=new StringBuilder();
			strSql.Append("delete from ZhiWuTuPian ");
			strSql.Append(" where TPBianHao=@TPBianHao");
			SqlParameter[] parameters = {
					new SqlParameter("@TPBianHao", SqlDbType.Int,4)
			};
			parameters[0].Value = TPBianHao;

			int rows=DbHelperSQL.ExecuteSql(strSql.ToString(),parameters);
			if (rows > 0)
			{
				return true;
			}
			else
			{
				return false;
			}
		}
        //
        /// <summary>
        ///
        /// </summary>
        /// <param name="TPBianHao"></param>
        /// <returns></returns>
        public bool DeleteByZhiwuId(int ZWBianHao)
        {

            StringBuilder strSql = new StringBuilder();
            strSql.Append("delete from ZhiWuTuPian ");
            strSql.Append(" where ZWBianHao=@ZWBianHao");
            SqlParameter[] parameters = {
                    new SqlParameter("@ZWBianHao", SqlDbType.Int,4)
            };
            parameters[0].Value = ZWBianHao;

            int rows = DbHelperSQL.ExecuteSql(strSql.ToString(), parameters);
            if (rows > 0)
            {
                return true;
            }
            else
            {
                return false;
            }
        }
        /// <summary>
        /// 批量删除数据
        /// </summary>
        public bool DeleteList(string TPBianHaolist )
		{
			StringBuilder strSql=new StringBuilder();
			strSql.Append("delete from ZhiWuTuPian ");
			strSql.Append(" where TPBianHao in ("+TPBianHaolist + ")  ");
			int rows=DbHelperSQL.ExecuteSql(strSql.ToString());
			if (rows > 0)
			{
				return true;
			}
			else
			{
				return false;
			}
		}


		/// <summary>
		/// 得到一个对象实体
		/// </summary>
		public SDAU.Model.ZhiWuTuPian GetModel(int ZWBianHao)
		{
			
			StringBuilder strSql=new StringBuilder();
			strSql.Append("select  top 1 TPBianHao,ZWBianHao,DiZhi,BeiZhu from ZhiWuTuPian ");
			strSql.Append(" where ZWBianHao=@ZWBianHao");
			SqlParameter[] parameters = {
					new SqlParameter("@ZWBianHao", SqlDbType.Int,4)
			};
			parameters[0].Value = ZWBianHao;

			SDAU.Model.ZhiWuTuPian model=new SDAU.Model.ZhiWuTuPian();
			DataSet ds=DbHelperSQL.Query(strSql.ToString(),parameters);
			if(ds.Tables[0].Rows.Count>0)
			{
				return DataRowToModel(ds.Tables[0].Rows[0]);
			}
			else
			{
				return null;
			}
		}
       
       

        /// <summary>
        /// 得到一个对象实体
        /// </summary>
        public SDAU.Model.ZhiWuTuPian DataRowToModel(DataRow row)
		{
			SDAU.Model.ZhiWuTuPian model=new SDAU.Model.ZhiWuTuPian();
			if (row != null)
			{
				if(row["TPBianHao"]!=null && row["TPBianHao"].ToString()!="")
				{
					model.TPBianHao=int.Parse(row["TPBianHao"].ToString());
				}
				if(row["ZWBianHao"]!=null && row["ZWBianHao"].ToString()!="")
				{
					model.ZWBianHao=int.Parse(row["ZWBianHao"].ToString());
				}
				if(row["DiZhi"]!=null)
				{
					model.DiZhi=row["DiZhi"].ToString();
				}
				if(row["BeiZhu"]!=null)
				{
					model.BeiZhu=row["BeiZhu"].ToString();
				}
			}
			return model;
		}

		/// <summary>
		/// 获得数据列表
		/// </summary>
		public DataSet GetList(string strWhere)
		{
            int ZWBianHao = Convert.ToInt32(strWhere);
			StringBuilder strSql=new StringBuilder();
			strSql.Append("select TPBianHao,ZWBianHao,DiZhi,BeiZhu ");
			strSql.Append(" FROM ZhiWuTuPian ");
			if(strWhere.Trim()!="")
			{
                strSql.Append("where ZWBianHao=@ZWBianHao ");
                strSql.Append(" order by TPBianHao desc ");
                SqlParameter[] parameters = {
                    new SqlParameter("@ZWBianHao", SqlDbType.Int,4)
            };
                parameters[0].Value = ZWBianHao;
                return DbHelperSQL.Query(strSql.ToString(),parameters);
            }
            else
            {
                return DbHelperSQL.Query(strSql.ToString());
            }
      
		}


        /// <summary>
        /// 获得前几行数据
        /// </summary>
        public DataSet GetList(int Top,string strWhere,string filedOrder)
		{
			StringBuilder strSql=new StringBuilder();
			strSql.Append("select ");
			if(Top>0)
			{
				strSql.Append(" top "+Top.ToString());
			}
			strSql.Append(" TPBianHao,ZWBianHao,DiZhi,BeiZhu ");
			strSql.Append(" FROM ZhiWuTuPian ");
			if(strWhere.Trim()!="")
			{
				strSql.Append(" where "+strWhere);
			}
			strSql.Append(" order by " + filedOrder);
			return DbHelperSQL.Query(strSql.ToString());
		}

		/// <summary>
		/// 获取记录总数
		/// </summary>
		public int GetRecordCount(string strWhere)
		{
			StringBuilder strSql=new StringBuilder();
			strSql.Append("select count(1) FROM ZhiWuTuPian ");
			if(strWhere.Trim()!="")
			{
				strSql.Append(" where "+strWhere);
			}
			object obj = DbHelperSQL.GetSingle(strSql.ToString());
			if (obj == null)
			{
				return 0;
			}
			else
			{
				return Convert.ToInt32(obj);
			}
		}
		/// <summary>
		/// 分页获取数据列表
		/// </summary>
		public DataSet GetListByPage(string strWhere, string orderby, int startIndex, int endIndex)
		{
			StringBuilder strSql=new StringBuilder();
			strSql.Append("SELECT * FROM ( ");
			strSql.Append(" SELECT ROW_NUMBER() OVER (");
			if (!string.IsNullOrEmpty(orderby.Trim()))
			{
				strSql.Append("order by T." + orderby );
			}
			else
			{
				strSql.Append("order by T.TPBianHao desc");
			}
			strSql.Append(")AS Row, T.*  from ZhiWuTuPian T ");
			if (!string.IsNullOrEmpty(strWhere.Trim()))
			{
				strSql.Append(" WHERE " + strWhere);
			}
			strSql.Append(" ) TT");
			strSql.AppendFormat(" WHERE TT.Row between {0} and {1}", startIndex, endIndex);
			return DbHelperSQL.Query(strSql.ToString());
		}

		/*
		/// <summary>
		/// 分页获取数据列表
		/// </summary>
		public DataSet GetList(int PageSize,int PageIndex,string strWhere)
		{
			SqlParameter[] parameters = {
					new SqlParameter("@tblName", SqlDbType.VarChar, 255),
					new SqlParameter("@fldName", SqlDbType.VarChar, 255),
					new SqlParameter("@PageSize", SqlDbType.Int),
					new SqlParameter("@PageIndex", SqlDbType.Int),
					new SqlParameter("@IsReCount", SqlDbType.Bit),
					new SqlParameter("@OrderType", SqlDbType.Bit),
					new SqlParameter("@strWhere", SqlDbType.VarChar,1000),
					};
			parameters[0].Value = "ZhiWuTuPian";
			parameters[1].Value = "TPBianHao";
			parameters[2].Value = PageSize;
			parameters[3].Value = PageIndex;
			parameters[4].Value = 0;
			parameters[5].Value = 0;
			parameters[6].Value = strWhere;	
			return DbHelperSQL.RunProcedure("UP_GetRecordByPage",parameters,"ds");
		}*/

		#endregion  BasicMethod
		#region  ExtensionMethod

		#endregion  ExtensionMethod
	}
}

