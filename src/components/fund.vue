<template>
  <div class="fund">
    <div class="card">
      <div class="fundCard">
        <h3>资金详情</h3>
        <p>账户余额</p>
        <h1>100000</h1>
        <el-button type="primary" round>提现</el-button>
      </div>
      <div class="infoCard">
        <h3>基本信息</h3>
        <el-form label-width="110px" :model="fundData" size="mini" style="padding-top:25px">
          <el-form-item label="银行卡号:">
            <span v-if="showBank">{{fundData.bankCard}}</span>
            <el-input v-else v-model="fundData.bankCard"></el-input>
          </el-form-item>
          <el-form-item label="开户行:">
            <span v-if="showBank">{{fundData.bankName}}</span>
            <el-input v-else v-model="fundData.bankName"></el-input>
          </el-form-item>
          <el-form-item label="手机号:">
            <span v-if="showBank">{{fundData.phone}}</span>
            <el-input v-else v-model="fundData.phone"></el-input>
          </el-form-item>
          <el-form-item label-width="240px">
            <el-button
              type="primary"
              size="small"
              @click="updata()"
              round
              plain
            >{{showBank?'修改':'保存'}}</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
    <div class="dataList">
      <div class="list">
        <el-tabs @tab-click="handleClick" v-model="activeName">
          <el-tab-pane label="收益记录" name="first">
            <el-table :data="earningData" style="width: 100%" max-height="360px" :header-cell-style="{background:'#f5f5f5',color:'#333'}">
              <el-table-column prop="id" label="ID" sortable></el-table-column>
              <el-table-column prop="name" label="用户名"></el-table-column>
              <el-table-column prop="phone" label="手机号"></el-table-column>
              <el-table-column prop="type" label="收益类别"></el-table-column>
              <el-table-column prop="time" label="收益时间" sortable></el-table-column>
              <el-table-column label="金额" width="100px;">
                <template slot-scope="{row}">
                  <span style="color:#F54848">{{row.money}}</span>
                </template>
              </el-table-column>
            </el-table>
          </el-tab-pane>
          <el-tab-pane label="提现记录" name="second">
            <el-table :data="withdrawData" style="width: 100%" max-height="360px" :header-cell-style="{background:'#f5f5f5',color:'#333'}">
              <el-table-column prop="id" label="序号" sortable></el-table-column>
              <el-table-column prop="money" label="提现金额"></el-table-column>
              <el-table-column prop="bankCard" label="到账银行卡"></el-table-column>
              <el-table-column prop="time" label="提现时间" sortable></el-table-column>
              <el-table-column prop="type" label="状态" width="100px"></el-table-column>
            </el-table>
          </el-tab-pane>
        </el-tabs>
      </div>
      <div class="paging">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page.sync="currentPage3"
          :page-size="100"
          layout="prev, pager, next, jumper"
          :total="1000"
        ></el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      fundData: {
        bankCard: "6666 6666 6666 6666",
        bankName: "平安银行",
        phone: "12818181818"
      },
      showBank: true,
      activeName: "second",
      currentPage1: 5,
      currentPage2: 5,
      currentPage3: 5,
      currentPage4: 4,
      earningData: [
        {
          id: "9999",
          name: "王小虎",
          phone: "13253437380",
          type:'购物',
          time:'2019-10-20 16：20：23',
          money:'8500'
        },
        {
          id: "9999",
          name: "王小虎",
          phone: "13253437380",
          type:'购物',
          time:'2019-10-20 16：20：23',
          money:'8500'
        },
        {
          id: "9999",
          name: "王小虎",
          phone: "13253437380",
          type:'购物',
          time:'2019-10-20 16：20：23',
          money:'8500'
        }
      ],
      withdrawData: [
        {
          id: "9999",
          money:'100000',
          bankCard: "6666 6666 6666 6666",
          time:'2019-10-20 16：20：23',
          type:'已提现'
        },
        {
          id: "9999",
          money:'100000',
          bankCard: "6666 6666 6666 6666",
          time:'2019-10-20 16：20：23',
          type:'已提现'
        },
        {
          id: "9999",
          money:'100000',
          bankCard: "6666 6666 6666 6666",
          time:'2019-10-20 16：20：23',
          type:'已提现'
        },
        {
          id: "9999",
          money:'100000',
          bankCard: "6666 6666 6666 6666",
          time:'2019-10-20 16：20：23',
          type:'已提现'
        },
        {
          id: "9999",
          money:'100000',
          bankCard: "6666 6666 6666 6666",
          time:'2019-10-20 16：20：23',
          type:'已提现'
        },
        {
          id: "9999",
          money:'100000',
          bankCard: "6666 6666 6666 6666",
          time:'2019-10-20 16：20：23',
          type:'已提现'
        },
        {
          id: "9999",
          money:'100000',
          bankCard: "6666 6666 6666 6666",
          time:'2019-10-20 16：20：23',
          type:'已提现'
        },
        {
          id: "9999",
          money:'100000',
          bankCard: "6666 6666 6666 6666",
          time:'2019-10-20 16：20：23',
          type:'已提现'
        },
        {
          id: "9999",
          money:'100000',
          bankCard: "6666 6666 6666 6666",
          time:'2019-10-20 16：20：23',
          type:'已提现'
        }
      ]
    };
  },
  created() {
    console.log(this.$route);
  },
  methods: {
    handleClick(tab, event) {
      console.log(tab, event);
    },
    // 分页
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
    },
    updata() {
      this.showBank = !this.showBank;
    }
  }
};
</script>

<style>
.fund {
  margin: 20px 20px;
}
.card {
  padding: 25px;
  height: 250px;
  border-radius: 8px;
  background: #fff;
  color: #333333;
  display: flex;
}
.card h3 {
  font-size: 16px;
  font-weight: bold;
  text-align: left;
}
.fundCard {
  width: 495px;
  height: 100%;
  border-right: 1px solid #d7d7d7;
  text-align: center;
}
.fundCard p {
  font-size: 16px;
  padding: 50px 0 10px;
}
.fundCard h1 {
  font-size: 50px;
  padding-bottom: 20px;
}
.infoCard {
  height: 100%;
  margin-left: 125px;
}
.dataList {
  padding: 15px 20px;
  background: #fff;
  margin-top: 20px;
  position: relative;
}
.list {
  min-height: 330px;
}
.el-tabs__nav-wrap::after {
  background-color: #ffffff;
}
</style>
