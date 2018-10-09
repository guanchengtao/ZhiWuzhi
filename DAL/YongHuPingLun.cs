using System;
using System.Data;
using System.Text;
using System.Data.SqlClient;
using Maticsoft.DBUtility;//Please add references
namespace SDAU.DAL
{
    /// <summary>
    /// 数据访问类:YongHuPingLun
    /// </summary>
    public partial class YongHuPingLun
    {
        public YongHuPingLun()
        { }
        #region  BasicMethod

        /// <summary>
        /// 得到最大ID
        /// </summary>
        public int GetMaxId()
        {
            return DbHelperSQL.GetMaxID("PLBianHao", "YongHuPingLun");
        }

        /// <summary>
        /// 是否存在该记录
        /// </summary>
        public bool Exists(int PLBianHao)
        {
            StringBuilder strSql = new StringBuilder();
            strSql.Append("select count(1) from YongHuPingLun");
            strSql.Append(" where PLBianHao=@PLBianHao ");
            SqlParameter[] parameters = {
                    new SqlParameter("@PLBianHao", SqlDbType.Int,4)         };
            parameters[0].Value = PLBianHao;

            return DbHelperSQL.Exists(strSql.ToString(), parameters);
        }


        /// <summary>
        /// 增加一条数据
        /// </summary>
        public int Add(SDAU.Model.YongHuPingLun model)
        {
            StringBuilder strSql = new StringBuilder();
            strSql.Append("insert into YongHuPingLun(");
            strSql.Append("ZWBianHao,YHBianHao,NeiRong,PLShiJian,BeiZhu)");
            strSql.Append(" values (");
            strSql.Append("@ZWBianHao,@YHBianHao,@NeiRong,@PLShiJian,@BeiZhu)");
            strSql.Append(";select @@IDENTITY");
            SqlParameter[] parameters = {
                    new SqlParameter("@ZWBianHao", SqlDbType.Int,4),
                    new SqlParameter("@YHBianHao", SqlDbType.Int,4),
                    new SqlParameter("@NeiRong", SqlDbType.NVarChar,-1),
                    new SqlParameter("@PLShiJian", SqlDbType.DateTime),
                    new SqlParameter("@BeiZhu", SqlDbType.NVarChar,50)};
            parameters[0].Value = model.ZWBianHao;
            parameters[1].Value = model.YHBianHao;
            parameters[2].Value = model.NeiRong;
            parameters[3].Value = model.PLShiJian;
            parameters[4].Value = model.BeiZhu;

            object obj = DbHelperSQL.GetSingle(strSql.ToString(), parameters);
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
        public bool Update(SDAU.Model.YongHuPingLun model)
        {
            StringBuilder strSql = new StringBuilder();
            strSql.Append("update YongHuPingLun set ");
            strSql.Append("YHBianHao=@YHBianHao,");
            strSql.Append("NeiRong=@NeiRong,");
            strSql.Append("PLShiJian=@PLShiJian,");
            strSql.Append("BeiZhu=@BeiZhu");
            strSql.Append(" where PLBianHao=@PLBianHao");
            SqlParameter[] parameters = {
                    new SqlParameter("@YHBianHao", SqlDbType.Int,4),
                    new SqlParameter("@NeiRong", SqlDbType.NVarChar,-1),
                    new SqlParameter("@PLShiJian", SqlDbType.DateTime),
                    new SqlParameter("@BeiZhu", SqlDbType.NVarChar,50),
                    new SqlParameter("@PLBianHao", SqlDbType.Int,4),
                    new SqlParameter("@ZWBianHao", SqlDbType.Int,4)};
            parameters[0].Value = model.YHBianHao;
            parameters[1].Value = model.NeiRong;
            parameters[2].Value = model.PLShiJian;
            parameters[3].Value = model.BeiZhu;
            parameters[4].Value = model.PLBianHao;
            parameters[5].Value = model.ZWBianHao;

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
        /// 删除一条数据
        /// </summary>
        public bool Delete(int PLBianHao)
        {

            StringBuilder strSql = new StringBuilder();
            strSql.Append("delete from YongHuPingLun ");
            strSql.Append(" where PLBianHao=@PLBianHao");
            SqlParameter[] parameters = {
                    new SqlParameter("@PLBianHao", SqlDbType.Int,4)
            };
            parameters[0].Value = PLBianHao;

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
        /// 删除一条数据
        /// </summary>

        public bool DeleteByZhiwuId(int ZWBianHao)
        {

            StringBuilder strSql = new StringBuilder();
            strSql.Append("delete from YongHuPingLun ");
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
        /// 
        /// </summary>
        /// <param name="ZWBianHaolist"></param>
        /// <returns></returns>
        public bool DeleteList(string ZWBianHaolist)
        {
            StringBuilder strSql = new StringBuilder();
            strSql.Append("delete from YongHuPingLun ");
            strSql.Append(" where ZWBianHao in (" + ZWBianHaolist + ")  ");
            int rows = DbHelperSQL.ExecuteSql(strSql.ToString());
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
        public SDAU.Model.YongHuPingLun GetModel(int PLBianHao)
        {

            StringBuilder strSql = new StringBuilder();
            strSql.Append("select  top 1 PLBianHao,ZWBianHao,YHBianHao,NeiRong,PLShiJian,BeiZhu from YongHuPingLun ");
            strSql.Append(" where PLBianHao=@PLBianHao");
            SqlParameter[] parameters = {
                    new SqlParameter("@PLBianHao", SqlDbType.Int,4)
            };
            parameters[0].Value = PLBianHao;

            SDAU.Model.YongHuPingLun model = new SDAU.Model.YongHuPingLun();
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
        public SDAU.Model.YongHuPingLun DataRowToModel(DataRow row)
        {
            SDAU.Model.YongHuPingLun model = new SDAU.Model.YongHuPingLun();
            if (row != null)
            {
                if (row["PLBianHao"] != null && row["PLBianHao"].ToString() != "")
                {
                    model.PLBianHao = int.Parse(row["PLBianHao"].ToString());
                }
                if (row["ZWBianHao"] != null && row["ZWBianHao"].ToString() != "")
                {
                    model.ZWBianHao = int.Parse(row["ZWBianHao"].ToString());
                }
                if (row["YHBianHao"] != null && row["YHBianHao"].ToString() != "")
                {
                    model.YHBianHao = int.Parse(row["YHBianHao"].ToString());
                }
                if (row["NeiRong"] != null)
                {
                    model.NeiRong = row["NeiRong"].ToString();
                }
                if (row["PLShiJian"] != null && row["PLShiJian"].ToString() != "")
                {
                    model.PLShiJian = DateTime.Parse(row["PLShiJian"].ToString());
                }
                if (row["BeiZhu"] != null)
                {
                    model.BeiZhu = row["BeiZhu"].ToString();
                }
            }
            return model;
        }

        /// <summary>
        /// 获得数据列表
        /// </summary>
        public DataSet GetList(string strWhere)
        {

            StringBuilder strSql = new StringBuilder();
            strSql.Append("select PLBianHao,ZWBianHao,YHBianHao,NeiRong,PLShiJian,BeiZhu ");
            strSql.Append(" FROM YongHuPingLun ");
            if (strWhere.Trim() != "")
            {
                int ZWBianHao = Int32.Parse(strWhere);
                strSql.Append(" where ZWBianHao=@ZWBianHao order by PLShiJian desc ");
                SqlParameter[] parameters = {
                    new SqlParameter("@ZWBianHao", SqlDbType.Int,4)
            };
                parameters[0].Value = ZWBianHao;
                return DbHelperSQL.Query(strSql.ToString(), parameters);
            }
            else
            {
                return DbHelperSQL.Query(strSql.ToString());
            }

        }

        /// <summary>
        /// 获得前几行数据
        /// </summary>
        public DataSet GetList(int Top, string strWhere, string filedOrder)
        {
            StringBuilder strSql = new StringBuilder();
            strSql.Append("select ");
            if (Top > 0)
            {
                strSql.Append(" top " + Top.ToString());
            }
            strSql.Append(" PLBianHao,ZWBianHao,YHBianHao,NeiRong,PLShiJian,BeiZhu ");
            strSql.Append(" FROM YongHuPingLun ");
            if (strWhere.Trim() != "")
            {
                strSql.Append(" where " + strWhere);
            }
            strSql.Append(" order by " + filedOrder);
            return DbHelperSQL.Query(strSql.ToString());
        }

        /// <summary>
        /// 获取记录总数
        /// </summary>
        public int GetRecordCount(string strWhere)
        {
            StringBuilder strSql = new StringBuilder();
            strSql.Append("select count(1) FROM YongHuPingLun ");
            strSql.Append(" where ZWBianHao=@strWhere");
            SqlParameter[] parameters = {
                new SqlParameter("@strWhere", SqlDbType.Int,4)
            };
            parameters[0].Value = strWhere;
        
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
				strSql.Append("order by T.PLShiJian desc");
			}
			strSql.Append(")AS Row, T.*  from YongHuPingLun T ");
			if (!string.IsNullOrEmpty(strWhere.Trim()))
			{
                strSql.Append(" where ZWBianHao=@strWhere");
                SqlParameter[] parameters = {
                new SqlParameter("@strWhere", SqlDbType.Int,4)
            };
                parameters[0].Value = strWhere;
                strSql.Append(" ) TT");
                strSql.AppendFormat(" WHERE TT.Row between {0} and {1}", startIndex, endIndex);
                return DbHelperSQL.Query(strSql.ToString(),parameters);
            }
            else
            {
                strSql.Append(" ) TT");
                strSql.AppendFormat(" WHERE TT.Row between {0} and {1}", startIndex, endIndex);
                return DbHelperSQL.Query(strSql.ToString());
            }
		}

	

		#endregion  BasicMethod
		#region  ExtensionMethod

		#endregion  ExtensionMethod
	}
}

