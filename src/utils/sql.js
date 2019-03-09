const mysql = require('mysql2')

const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'pan9pang',
  database: 'appletuan',
  waitForConnections: true,
  connectionLimit: 20,
  queueLimit: 0
})

function insert(data){
  let sql = 'REPLACE INTO detail(id,model,chanpinshangbiao,qiyemingcheng,cheliangxinghao,gonggaopici,waixingchicun,meitirongji,zongzhiliang,edingzhiliang,zhengbeizhiliang,qianpaichengke,zhouhe,mianzheng,zuigaoshisu,ranyou,youhao,huanbao,ranyouleixing,paifangbiaozhun,zhuyao_qita,dipanxinghao,dipanpinpai,zhoushu,qianlunju,zhouju,houlunju,luntaishu,luntaiguige,jiejinliqujiao,qianxuanhouxuan,fadongjixinghao,fadongjishengchanqiye,pailiang,gonglv) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)'
  sql = mysql.format(sql, data);
  pool.query(sql, function (error, results, fields) {
    if (error) {
      console.log(error, data)
      // throw error
    };
    return new Promise((resolve, reject) => {
      resolve('sql success')
    })
  });
}

exports.insert = insert