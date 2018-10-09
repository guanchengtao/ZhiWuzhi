using System;
using System.Data;
using System.Text;
using System.Data.SqlClient;
using Maticsoft.DBUtility;//Please add references
using SDAU.Model;
using System.Collections.Generic;

namespace SDAU.DAL
{
	/// <summary>
	/// 数据访问类:YongHuXinXi
	/// </summary>
	public partial class YongHuXinXi
	{
		public YongHuXinXi()
		{}
		#region  BasicMethod

		/// <summary>
		/// 得到最大ID
		/// </summary>
		public int GetMaxId()
		{
		return DbHelperSQL.GetMaxID("YHBianHao", "YongHuXinXi"); 
		}

		/// <summary>
		/// 是否存在该记录
		/// </summary>
		public bool Exists(int YHBianHao)
		{
			StringBuilder strSql=new StringBuilder();
			strSql.Append("select count(1) from YongHuXinXi");
			strSql.Append(" where YHBianHao=@YHBianHao");
			SqlParameter[] parameters = {
					new SqlParameter("@YHBianHao", SqlDbType.Int,4)
			};
			parameters[0].Value = YHBianHao;

			return DbHelperSQL.Exists(strSql.ToString(),parameters);
		}

        public bool userExists(string name,string pwd)
        {
            StringBuilder strSql = new StringBuilder();
            strSql.Append("select count(1) from YongHuXinXi");
            strSql.Append(" where YongHuMing=@name and  ");
                strSql.Append("YongHuMiMa=@pwd");
            SqlParameter[] parameters = {
                  new SqlParameter("@name", SqlDbType.VarChar,20),
                 new SqlParameter("@pwd", SqlDbType.VarChar,32),
            };
            parameters[0].Value =name;
            parameters[1].Value = pwd;
            return DbHelperSQL.Exists(strSql.ToString(), parameters);
        }
        //用户注册
        public bool userZhuceExists(string name)
        {
            StringBuilder strSql = new StringBuilder();
            strSql.Append("select count(1) from YongHuXinXi");
            strSql.Append(" where YongHuMing=@name");
         
            SqlParameter[] parameters = {
                  new SqlParameter("@name", SqlDbType.VarChar,20),
     
            };
            parameters[0].Value = name;

            return DbHelperSQL.Exists(strSql.ToString(), parameters);
        }
        /// <summary>
        /// 增加一条数据
        /// </summary>
        public int Add(SDAU.Model.YongHuXinXi model)
		{
			StringBuilder strSql=new StringBuilder();
			strSql.Append("insert into YongHuXinXi(");
			strSql.Append("YongHuMing,YongHuMiMa,YouXiang,ZhuCeShiJian,QuanXian,TouXiang,BeiZhu)");
			strSql.Append(" values (");
			strSql.Append("@YongHuMing,@YongHuMiMa,@YouXiang,@ZhuCeShiJian,@QuanXian,@TouXiang,@BeiZhu)");
			strSql.Append(";select @@IDENTITY");
			SqlParameter[] parameters = {
					new SqlParameter("@YongHuMing", SqlDbType.VarChar,20),
					new SqlParameter("@YongHuMiMa", SqlDbType.VarChar,32),
					new SqlParameter("@YouXiang", SqlDbType.NVarChar,50),
					new SqlParameter("@ZhuCeShiJian", SqlDbType.DateTime),
					new SqlParameter("@QuanXian", SqlDbType.Int,4),
					new SqlParameter("@TouXiang", SqlDbType.Image),
					new SqlParameter("@BeiZhu", SqlDbType.NVarChar,500)};
			parameters[0].Value = model.YongHuMing;
			parameters[1].Value = model.YongHuMiMa;
			parameters[2].Value = model.YouXiang;
			parameters[3].Value = model.ZhuCeShiJian;
			parameters[4].Value = model.QuanXian;
			parameters[5].Value = model.TouXiang;
			parameters[6].Value = model.BeiZhu;

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
		public bool Update(SDAU.Model.YongHuXinXi model)
		{
			StringBuilder strSql=new StringBuilder();
			strSql.Append("update YongHuXinXi set ");
			strSql.Append("YongHuMing=@YongHuMing,");
			strSql.Append("YongHuMiMa=@YongHuMiMa,");
			strSql.Append("YouXiang=@YouXiang,");
			strSql.Append("ZhuCeShiJian=@ZhuCeShiJian,");
			strSql.Append("QuanXian=@QuanXian,");
			strSql.Append("TouXiang=@TouXiang,");
			strSql.Append("BeiZhu=@BeiZhu");
			strSql.Append(" where YHBianHao=@YHBianHao");
			SqlParameter[] parameters = {
					new SqlParameter("@YongHuMing", SqlDbType.VarChar,20),
                    new SqlParameter("@YongHuMiMa", SqlDbType.VarChar,32),
                    new SqlParameter("@YouXiang", SqlDbType.NVarChar,50),
					new SqlParameter("@ZhuCeShiJian", SqlDbType.DateTime),
					new SqlParameter("@QuanXian", SqlDbType.Int,4),
					new SqlParameter("@TouXiang", SqlDbType.Image),
					new SqlParameter("@BeiZhu", SqlDbType.NVarChar,500),
					new SqlParameter("@YHBianHao", SqlDbType.Int,4)};
			parameters[0].Value = model.YongHuMing;
			parameters[1].Value = model.YongHuMiMa;
			parameters[2].Value = model.YouXiang;
			parameters[3].Value = model.ZhuCeShiJian;
			parameters[4].Value = model.QuanXian;
			parameters[5].Value = model.TouXiang;
			parameters[6].Value = model.BeiZhu;
			parameters[7].Value = model.YHBianHao;

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
		public bool Delete(int YHBianHao)
		{
			
			StringBuilder strSql=new StringBuilder();
			strSql.Append("delete from YongHuXinXi ");
			strSql.Append(" where YHBianHao=@YHBianHao");
			SqlParameter[] parameters = {
					new SqlParameter("@YHBianHao", SqlDbType.Int,4)
			};
			parameters[0].Value = YHBianHao;

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
        /// 批量删除数据
        /// </summary>
        public bool DeleteList(string YHBianHaolist )
		{
			StringBuilder strSql=new StringBuilder();
			strSql.Append("delete from YongHuXinXi ");
			strSql.Append(" where YHBianHao in ("+YHBianHaolist + ")  ");
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
		public SDAU.Model.YongHuXinXi GetModel(int YHBianHao)
		{
			
			StringBuilder strSql=new StringBuilder();
			strSql.Append("select  top 1 YHBianHao,YongHuMing,YongHuMiMa,YouXiang,ZhuCeShiJian,QuanXian,TouXiang,BeiZhu from YongHuXinXi ");
			strSql.Append(" where YHBianHao=@YHBianHao");
			SqlParameter[] parameters = {
					new SqlParameter("@YHBianHao", SqlDbType.Int,4)
			};
			parameters[0].Value = YHBianHao;

			SDAU.Model.YongHuXinXi model=new SDAU.Model.YongHuXinXi();
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


        public SDAU.Model.YongHuXinXi GetModel(string username)
        {

            StringBuilder strSql = new StringBuilder();
            strSql.Append("select  top 1 YHBianHao,YongHuMing,YongHuMiMa,YouXiang,ZhuCeShiJian,QuanXian,TouXiang,BeiZhu from YongHuXinXi ");
            strSql.Append(" where YongHuMing=@YongHuMing");
            SqlParameter[] parameters = {
                    new SqlParameter("@YongHuMing", SqlDbType.VarChar,20)
            };
            parameters[0].Value = username;

            SDAU.Model.YongHuXinXi model = new SDAU.Model.YongHuXinXi();
            DataSet ds = DbHelperSQL.Query(strSql.ToString(), parameters);
            if (ds.Tables[0].Rows.Count > 0)
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
        public SDAU.Model.YongHuXinXi DataRowToModel(DataRow row)
		{
			SDAU.Model.YongHuXinXi model=new SDAU.Model.YongHuXinXi();
			if (row != null)
			{
				if(row["YHBianHao"]!=null && row["YHBianHao"].ToString()!="")
				{
					model.YHBianHao=int.Parse(row["YHBianHao"].ToString());
				}
				if(row["YongHuMing"]!=null)
				{
					model.YongHuMing=row["YongHuMing"].ToString();
				}
				if(row["YongHuMiMa"]!=null)
				{
					model.YongHuMiMa=row["YongHuMiMa"].ToString();
				}
				if(row["YouXiang"]!=null)
				{
					model.YouXiang=row["YouXiang"].ToString();
				}
				if(row["ZhuCeShiJian"]!=null && row["ZhuCeShiJian"].ToString()!="")
				{
					model.ZhuCeShiJian=DateTime.Parse(row["ZhuCeShiJian"].ToString());
				}
				if(row["QuanXian"]!=null && row["QuanXian"].ToString()!="")
				{
					model.QuanXian=int.Parse(row["QuanXian"].ToString());
				}
				if(row["TouXiang"]!=null && row["TouXiang"].ToString()!="")
				{
					model.TouXiang=(byte[])row["TouXiang"];
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
			StringBuilder strSql=new StringBuilder();
			strSql.Append("select YHBianHao,YongHuMing,YongHuMiMa,YouXiang,ZhuCeShiJian,QuanXian,TouXiang,BeiZhu ");
			strSql.Append(" FROM YongHuXinXi ");
			if(strWhere.Trim()!="")
			{
				strSql.Append(" where "+strWhere);
			}
			return DbHelperSQL.Query(strSql.ToString());
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
			strSql.Append(" YHBianHao,YongHuMing,YongHuMiMa,YouXiang,ZhuCeShiJian,QuanXian,TouXiang,BeiZhu ");
			strSql.Append(" FROM YongHuXinXi ");
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
			strSql.Append("select count(1) FROM YongHuXinXi ");
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
				strSql.Append("order by T.YHBianHao desc");
			}
			strSql.Append(")AS Row, T.*  from YongHuXinXi T ");
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
			parameters[0].Value = "YongHuXinXi";
			parameters[1].Value = "YHBianHao";
			parameters[2].Value = PageSize;
			parameters[3].Value = PageIndex;
			parameters[4].Value = 0;
			parameters[5].Value = 0;
			parameters[6].Value = strWhere;	
			return DbHelperSQL.RunProcedure("UP_GetRecordByPage",parameters,"ds");
		}*/

        #endregion  BasicMethod
        #region  ExtensionMethod
        public List<Model.YongHuXinXi> LoadPageData(int pageIndex, int pageSize, out int total)
        {
            DataSet ds = new DataSet();

            SqlParameter totalParameter = new SqlParameter("@total", SqlDbType.Int);
            totalParameter.Direction = ParameterDirection.Output;
            //DbHelperSQL.RunProcedure()


            //如果用了输出参数，那么就用SqlDataAdapter就可以了，用sqlDataReader时候拿不到输出参数的值。
            using (SqlConnection conn = new SqlConnection(DbHelperSQL.connectionString))
            {
                //conn.Open();
                using (SqlDataAdapter adapter = new SqlDataAdapter("P_LoadPageData", conn))
                {
                    adapter.SelectCommand.Parameters.Add(new SqlParameter("@pageIndex", pageIndex));
                    adapter.SelectCommand.Parameters.Add(new SqlParameter("@pageSize", pageSize));

                    adapter.SelectCommand.CommandType = CommandType.StoredProcedure;

                    //输出参数的用法
                    adapter.SelectCommand.Parameters.Add(totalParameter);

                    adapter.Fill(ds);
                }
            }
            total = (int)totalParameter.Value;//拿到输出参数的值

            return this.DataTableToList(ds.Tables[0]);

        }
        public List<Model.YongHuXinXi> DataTableToList(DataTable dt)
        {
            List<Model.YongHuXinXi> modelList = new List<Model.YongHuXinXi>();
            int rowsCount = dt.Rows.Count;
            if (rowsCount > 0)
            {
                Model.YongHuXinXi model;
                for (int n = 0; n < rowsCount; n++)
                {
                    model = DataRowToModel(dt.Rows[n]);
                    if (model != null)
                    {
                        modelList.Add(model);
                    }
                }
            }
            return modelList;
        }
        #endregion  ExtensionMethod
    }
}

