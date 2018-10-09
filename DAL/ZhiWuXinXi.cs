using System;
using System.Data;
using System.Text;
using System.Data.SqlClient;
using Maticsoft.DBUtility;//Please add references
namespace SDAU.DAL
{
	/// <summary>
	/// 数据访问类:ZhiWuXinXi
	/// </summary>
	public partial class ZhiWuXinXi
	{
		public ZhiWuXinXi()
		{}
		#region  BasicMethod

		/// <summary>
		/// 得到最大ID
		/// </summary>
		public int GetMaxId()
		{
		return DbHelperSQL.GetMaxID("ZWBianHao", "ZhiWuXinXi"); 
		}

		/// <summary>
		/// 是否存在该记录
		/// </summary>
		public bool Exists(int ZWBianHao)
		{
			StringBuilder strSql=new StringBuilder();
			strSql.Append("select count(1) from ZhiWuXinXi");
			strSql.Append(" where ZWBianHao=@ZWBianHao");
			SqlParameter[] parameters = {
					new SqlParameter("@ZWBianHao", SqlDbType.Int,4)
			};
			parameters[0].Value = ZWBianHao;

			return DbHelperSQL.Exists(strSql.ToString(),parameters);
		}


		/// <summary>
		/// 增加一条数据
		/// </summary>
		public int Add(SDAU.Model.ZhiWuXinXi model)
		{
			StringBuilder strSql=new StringBuilder();
			strSql.Append("insert into ZhiWuXinXi(");
			strSql.Append("ZWXueMing,YingWenMing,LDXueMing,BieCheng,Xiaoqu,WeiZhi,BJWenHua,Men,Gang,YaGang,Mu,YaMu,JingDu,WeiDu,Shu,Zhong,FBQuYu,ChanDi,SCHuanJing,XTTeZheng,ZPJiShu,ZYJiaZhi,FZFangFa,SZXiXing,BeiZhu)");
			strSql.Append(" values (");
			strSql.Append("@ZWXueMing,@YingWenMing,@LDXueMing,@BieCheng,@Xiaoqu,@WeiZhi,@BJWenHua,@Men,@Gang,@YaGang,@Mu,@YaMu,@JingDu,@WeiDu,@Shu,@Zhong,@FBQuYu,@ChanDi,@SCHuanJing,@XTTeZheng,@ZPJiShu,@ZYJiaZhi,@FZFangFa,@SZXiXing,@BeiZhu)");
			strSql.Append(";select @@IDENTITY");
			SqlParameter[] parameters = {
					new SqlParameter("@ZWXueMing", SqlDbType.VarChar,20),
					new SqlParameter("@YingWenMing", SqlDbType.VarChar,50),
					new SqlParameter("@LDXueMing", SqlDbType.VarChar,50),
					new SqlParameter("@BieCheng", SqlDbType.VarChar,20),
					new SqlParameter("@Xiaoqu", SqlDbType.VarChar,20),
					new SqlParameter("@WeiZhi", SqlDbType.VarChar,50),
					new SqlParameter("@BJWenHua", SqlDbType.NVarChar,50),
					new SqlParameter("@Men", SqlDbType.VarChar,10),
					new SqlParameter("@Gang", SqlDbType.VarChar,10),
					new SqlParameter("@YaGang", SqlDbType.VarChar,10),
					new SqlParameter("@Mu", SqlDbType.VarChar,200),
					new SqlParameter("@YaMu", SqlDbType.VarChar,10),
					new SqlParameter("@JingDu", SqlDbType.VarChar,10),
					new SqlParameter("@WeiDu", SqlDbType.VarChar,10),
					new SqlParameter("@Shu", SqlDbType.VarChar,10),
					new SqlParameter("@Zhong", SqlDbType.VarChar,10),
					new SqlParameter("@FBQuYu", SqlDbType.NVarChar,500),
					new SqlParameter("@ChanDi", SqlDbType.NVarChar,500),
					new SqlParameter("@SCHuanJing", SqlDbType.NVarChar,-1),
					new SqlParameter("@XTTeZheng", SqlDbType.NVarChar,-1),
					new SqlParameter("@ZPJiShu", SqlDbType.NVarChar,-1),
					new SqlParameter("@ZYJiaZhi", SqlDbType.NVarChar,-1),
					new SqlParameter("@FZFangFa", SqlDbType.NVarChar,-1),
					new SqlParameter("@SZXiXing", SqlDbType.NVarChar,-1),
					new SqlParameter("@BeiZhu", SqlDbType.NVarChar,50)};
			parameters[0].Value = model.ZWXueMing;
			parameters[1].Value = model.YingWenMing;
			parameters[2].Value = model.LDXueMing;
			parameters[3].Value = model.BieCheng;
			parameters[4].Value = model.Xiaoqu;
			parameters[5].Value = model.WeiZhi;
			parameters[6].Value = model.BJWenHua;
			parameters[7].Value = model.Men;
			parameters[8].Value = model.Gang;
			parameters[9].Value = model.YaGang;
			parameters[10].Value = model.Mu;
			parameters[11].Value = model.YaMu;
			parameters[12].Value = model.JingDu;
			parameters[13].Value = model.WeiDu;
			parameters[14].Value = model.Shu;
			parameters[15].Value = model.Zhong;
			parameters[16].Value = model.FBQuYu;
			parameters[17].Value = model.ChanDi;
			parameters[18].Value = model.SCHuanJing;
			parameters[19].Value = model.XTTeZheng;
			parameters[20].Value = model.ZPJiShu;
			parameters[21].Value = model.ZYJiaZhi;
			parameters[22].Value = model.FZFangFa;
			parameters[23].Value = model.SZXiXing;
			parameters[24].Value = model.BeiZhu;

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
		public bool Update(SDAU.Model.ZhiWuXinXi model)
		{
			StringBuilder strSql=new StringBuilder();
			strSql.Append("update ZhiWuXinXi set ");
			strSql.Append("ZWXueMing=@ZWXueMing,");
			strSql.Append("YingWenMing=@YingWenMing,");
			strSql.Append("LDXueMing=@LDXueMing,");
			strSql.Append("BieCheng=@BieCheng,");
			strSql.Append("Xiaoqu=@Xiaoqu,");
			strSql.Append("WeiZhi=@WeiZhi,");
			strSql.Append("BJWenHua=@BJWenHua,");
			strSql.Append("Men=@Men,");
			strSql.Append("Gang=@Gang,");
			strSql.Append("YaGang=@YaGang,");
			strSql.Append("Mu=@Mu,");
			strSql.Append("YaMu=@YaMu,");
			strSql.Append("JingDu=@JingDu,");
			strSql.Append("WeiDu=@WeiDu,");
			strSql.Append("Shu=@Shu,");
			strSql.Append("Zhong=@Zhong,");
			strSql.Append("FBQuYu=@FBQuYu,");
			strSql.Append("ChanDi=@ChanDi,");
			strSql.Append("SCHuanJing=@SCHuanJing,");
			strSql.Append("XTTeZheng=@XTTeZheng,");
			strSql.Append("ZPJiShu=@ZPJiShu,");
			strSql.Append("ZYJiaZhi=@ZYJiaZhi,");
			strSql.Append("FZFangFa=@FZFangFa,");
			strSql.Append("SZXiXing=@SZXiXing,");
			strSql.Append("BeiZhu=@BeiZhu");
			strSql.Append(" where ZWBianHao=@ZWBianHao");
			SqlParameter[] parameters = {
					new SqlParameter("@ZWXueMing", SqlDbType.VarChar,20),
					new SqlParameter("@YingWenMing", SqlDbType.VarChar,50),
					new SqlParameter("@LDXueMing", SqlDbType.VarChar,50),
					new SqlParameter("@BieCheng", SqlDbType.VarChar,20),
					new SqlParameter("@Xiaoqu", SqlDbType.VarChar,20),
					new SqlParameter("@WeiZhi", SqlDbType.VarChar,50),
					new SqlParameter("@BJWenHua", SqlDbType.NVarChar,50),
					new SqlParameter("@Men", SqlDbType.VarChar,10),
					new SqlParameter("@Gang", SqlDbType.VarChar,10),
					new SqlParameter("@YaGang", SqlDbType.VarChar,10),
					new SqlParameter("@Mu", SqlDbType.VarChar,200),
					new SqlParameter("@YaMu", SqlDbType.VarChar,10),
					new SqlParameter("@JingDu", SqlDbType.VarChar,10),
					new SqlParameter("@WeiDu", SqlDbType.VarChar,10),
					new SqlParameter("@Shu", SqlDbType.VarChar,10),
					new SqlParameter("@Zhong", SqlDbType.VarChar,10),
					new SqlParameter("@FBQuYu", SqlDbType.NVarChar,500),
					new SqlParameter("@ChanDi", SqlDbType.NVarChar,500),
					new SqlParameter("@SCHuanJing", SqlDbType.NVarChar,-1),
					new SqlParameter("@XTTeZheng", SqlDbType.NVarChar,-1),
					new SqlParameter("@ZPJiShu", SqlDbType.NVarChar,-1),
					new SqlParameter("@ZYJiaZhi", SqlDbType.NVarChar,-1),
					new SqlParameter("@FZFangFa", SqlDbType.NVarChar,-1),
					new SqlParameter("@SZXiXing", SqlDbType.NVarChar,-1),
					new SqlParameter("@BeiZhu", SqlDbType.NVarChar,50),
					new SqlParameter("@ZWBianHao", SqlDbType.Int,4)};
			parameters[0].Value = model.ZWXueMing;
			parameters[1].Value = model.YingWenMing;
			parameters[2].Value = model.LDXueMing;
			parameters[3].Value = model.BieCheng;
			parameters[4].Value = model.Xiaoqu;
			parameters[5].Value = model.WeiZhi;
			parameters[6].Value = model.BJWenHua;
			parameters[7].Value = model.Men;
			parameters[8].Value = model.Gang;
			parameters[9].Value = model.YaGang;
			parameters[10].Value = model.Mu;
			parameters[11].Value = model.YaMu;
			parameters[12].Value = model.JingDu;
			parameters[13].Value = model.WeiDu;
			parameters[14].Value = model.Shu;
			parameters[15].Value = model.Zhong;
			parameters[16].Value = model.FBQuYu;
			parameters[17].Value = model.ChanDi;
			parameters[18].Value = model.SCHuanJing;
			parameters[19].Value = model.XTTeZheng;
			parameters[20].Value = model.ZPJiShu;
			parameters[21].Value = model.ZYJiaZhi;
			parameters[22].Value = model.FZFangFa;
			parameters[23].Value = model.SZXiXing;
			parameters[24].Value = model.BeiZhu;
			parameters[25].Value = model.ZWBianHao;

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
		/// 通过照片ID删除一条数据
		/// </summary>
		public bool Delete(int ZWBianHao)
		{
			
			StringBuilder strSql=new StringBuilder();
			strSql.Append("delete from ZhiWuXinXi ");
			strSql.Append(" where ZWBianHao=@ZWBianHao");
			SqlParameter[] parameters = {
					new SqlParameter("@ZWBianHao", SqlDbType.Int,4)
			};
			parameters[0].Value = ZWBianHao;

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
        public bool DeleteList(string ZWBianHaolist )
		{
			StringBuilder strSql=new StringBuilder();
			strSql.Append("delete from ZhiWuXinXi ");
			strSql.Append(" where ZWBianHao in ("+ZWBianHaolist + ")  ");
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
		public SDAU.Model.ZhiWuXinXi GetModel(int ZWBianHao)
		{
			
			StringBuilder strSql=new StringBuilder();
			strSql.Append("select  top 1 ZWBianHao,ZWXueMing,YingWenMing,LDXueMing,BieCheng,Xiaoqu,WeiZhi,BJWenHua,Men,Gang,YaGang,Mu,YaMu,JingDu,WeiDu,Shu,Zhong,FBQuYu,ChanDi,SCHuanJing,XTTeZheng,ZPJiShu,ZYJiaZhi,FZFangFa,SZXiXing,BeiZhu from ZhiWuXinXi ");
			strSql.Append(" where ZWBianHao=@ZWBianHao");
			SqlParameter[] parameters = {
					new SqlParameter("@ZWBianHao", SqlDbType.Int,4)
			};
			parameters[0].Value = ZWBianHao;

			SDAU.Model.ZhiWuXinXi model=new SDAU.Model.ZhiWuXinXi();
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
		public SDAU.Model.ZhiWuXinXi DataRowToModel(DataRow row)
		{
			SDAU.Model.ZhiWuXinXi model=new SDAU.Model.ZhiWuXinXi();
			if (row != null)
			{
				if(row["ZWBianHao"]!=null && row["ZWBianHao"].ToString()!="")
				{
					model.ZWBianHao=int.Parse(row["ZWBianHao"].ToString());
				}
				if(row["ZWXueMing"]!=null)
				{
					model.ZWXueMing=row["ZWXueMing"].ToString();
				}
				if(row["YingWenMing"]!=null)
				{
					model.YingWenMing=row["YingWenMing"].ToString();
				}
				if(row["LDXueMing"]!=null)
				{
					model.LDXueMing=row["LDXueMing"].ToString();
				}
				if(row["BieCheng"]!=null)
				{
					model.BieCheng=row["BieCheng"].ToString();
				}
				if(row["Xiaoqu"]!=null)
				{
					model.Xiaoqu=row["Xiaoqu"].ToString();
				}
				if(row["WeiZhi"]!=null)
				{
					model.WeiZhi=row["WeiZhi"].ToString();
				}
				if(row["BJWenHua"]!=null)
				{
					model.BJWenHua=row["BJWenHua"].ToString();
				}
				if(row["Men"]!=null)
				{
					model.Men=row["Men"].ToString();
				}
				if(row["Gang"]!=null)
				{
					model.Gang=row["Gang"].ToString();
				}
				if(row["YaGang"]!=null)
				{
					model.YaGang=row["YaGang"].ToString();
				}
				if(row["Mu"]!=null)
				{
					model.Mu=row["Mu"].ToString();
				}
				if(row["YaMu"]!=null)
				{
					model.YaMu=row["YaMu"].ToString();
				}
				if(row["JingDu"]!=null)
				{
					model.JingDu=row["JingDu"].ToString();
				}
				if(row["WeiDu"]!=null)
				{
					model.WeiDu=row["WeiDu"].ToString();
				}
				if(row["Shu"]!=null)
				{
					model.Shu=row["Shu"].ToString();
				}
				if(row["Zhong"]!=null)
				{
					model.Zhong=row["Zhong"].ToString();
				}
				if(row["FBQuYu"]!=null)
				{
					model.FBQuYu=row["FBQuYu"].ToString();
				}
				if(row["ChanDi"]!=null)
				{
					model.ChanDi=row["ChanDi"].ToString();
				}
				if(row["SCHuanJing"]!=null)
				{
					model.SCHuanJing=row["SCHuanJing"].ToString();
				}
				if(row["XTTeZheng"]!=null)
				{
					model.XTTeZheng=row["XTTeZheng"].ToString();
				}
				if(row["ZPJiShu"]!=null)
				{
					model.ZPJiShu=row["ZPJiShu"].ToString();
				}
				if(row["ZYJiaZhi"]!=null)
				{
					model.ZYJiaZhi=row["ZYJiaZhi"].ToString();
				}
				if(row["FZFangFa"]!=null)
				{
					model.FZFangFa=row["FZFangFa"].ToString();
				}
				if(row["SZXiXing"]!=null)
				{
					model.SZXiXing=row["SZXiXing"].ToString();
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
			strSql.Append("select ZWBianHao,ZWXueMing,YingWenMing,LDXueMing,BieCheng,Xiaoqu,WeiZhi,BJWenHua,Men,Gang,YaGang,Mu,YaMu,JingDu,WeiDu,Shu,Zhong,FBQuYu,ChanDi,SCHuanJing,XTTeZheng,ZPJiShu,ZYJiaZhi,FZFangFa,SZXiXing,BeiZhu ");
			strSql.Append(" FROM ZhiWuXinXi ");
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
			strSql.Append(" ZWBianHao,ZWXueMing,YingWenMing,LDXueMing,BieCheng,Xiaoqu,WeiZhi,BJWenHua,Men,Gang,YaGang,Mu,YaMu,JingDu,WeiDu,Shu,Zhong,FBQuYu,ChanDi,SCHuanJing,XTTeZheng,ZPJiShu,ZYJiaZhi,FZFangFa,SZXiXing,BeiZhu ");
			strSql.Append(" FROM ZhiWuXinXi ");
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
			strSql.Append("select count(1) FROM ZhiWuXinXi ");
			if(strWhere.Trim()!="")
			{
                strSql.Append(" where ZWXueMing=@strWhere");
                SqlParameter[] parameters = {
                    new SqlParameter("@strWhere", SqlDbType.VarChar,20)
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
            else
            {
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
				strSql.Append("order by T.ZWBianHao desc");
			}
			strSql.Append(")AS Row, T.*  from ZhiWuXinXi T ");
			if (!string.IsNullOrEmpty(strWhere.Trim()))
			{
		
                strSql.Append(" where ZWXueMing=@strWhere");
                SqlParameter[] parameters = {
            new SqlParameter("@strWhere", SqlDbType.VarChar,20)
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

