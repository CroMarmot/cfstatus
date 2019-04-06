<template>
  <section class="container">
    <div>
      <input v-model="username"/>
      <button @click="getdata">Search</button>
      <div v-if="searching"> searching...</div>
      <div class="errorReason" v-if="errorReason !== '' "> {{errorReason}}</div>
    </div>
    <div class="ui-div-box">
      <div
        class="ui-div-eachyear"
        v-for=" (yeardata,year) in greenred"
        :key="year"
        :class="{ [year]:true }"
      >
        <h4>{{ year }}</h4>
        <div class="ui-div-eachyear-data">
          <div class="ui-div-datapart">
            <div
              v-for=" v of yeardata"
              :key="v.day"
              class="ui-div-eachday"
            >
              <div
                class="ui-div-square bggrey"
                v-if="v.green+v.red == 0"
                :class=" { ['year' + year]: true , ['month' + Math.floor(v.day / 100)%100 ]: true}"
              ></div>
              <div class="ui-div-square" v-if="v.green+v.red != 0">
                <div
                  class="ui-div-square-sub bggreen"
                  :style="{ flex: v.green }"></div>
                <div class="ui-div-square-gsub bgred" :style="{ flex: v.red }"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    </div>
  </section>
</template>

<script>
  // import Logo from '~/components/Logo.vue'
  import axios from 'axios'
  import _ from 'lodash'

  const intDiv = function (val1, val2) {
    if (val2 === 0) return NaN
    return (val1 - val1 % val2) / val2
  }
  const dateparse = function (val) {
    const d = new Date(val)
    return [d.getFullYear(), d.getMonth() + 1, d.getDate()]
  }
  const timestamp2number = function (val) {
    const [y, m, d] = dateparse(val)
    return y * 10000 + m * 100 + d
  }
  const nextDayNumber = function (val) {
    const [y, m, d] = [intDiv(val, 10000), intDiv(val, 100) % 100, val % 100 + 1]
    const dt = new Date(y, m - 1, d)
    return timestamp2number(dt.getTime())
  }

  class Date2GR {
    // date to green red
    constructor(day) {
      this.day = day
      this.green = 0
      this.red = 0
    }

    addResult(val) {
      if (val === 'OK') {
        this.green++
      } else {
        this.red++
      }
      return this
    }
  }

  export default {
    components: {},
    data: function () {
      return {
        username: 'Cro-Marmot',
        userdata: [],
        errorReason: '',
        searching: false
      }
    },
    watch: {
      username: function () {
        if (this.errorReason !== '') {
          this.errorReason = ''
        }
      }
    },
    methods: {
      getdata() {
        this.searching = true
        const url = 'https://codeforces.com/api/user.status?handle=' + this.username
        axios.get(url).then((value) => {
          console.log('ok:' + value)
          this.userdata = value.data.result
          this.searching = false
        }).catch((reason) => {
          this.searching = false
          this.errorReason = `未找到结果(${reason})`
        })
      }
    },
    computed: {
      'greenred': function () {
        const ret = {}
        const d2ggMap = new Map(null)
        if (this.userdata.length === 0) return ret
        const todayDate = timestamp2number(new Date().getTime()) // TODO
        let minDate = todayDate
        _.forEach(this.userdata, (raw) => {
          if (_.isUndefined(raw.author.startTimeSeconds)) return
          const key = timestamp2number(raw.author.startTimeSeconds * 1000)
          const record = d2ggMap.has(key) ? d2ggMap.get(key) : (new Date2GR(key))
          d2ggMap.set(key, record.addResult(raw.verdict))
          minDate = Math.min(minDate, key)
        })
        minDate = intDiv(minDate, 10000) * 10000 + 101;
        let year = 1970
        let retyear = []
        for (let i = minDate; i <= todayDate; i = nextDayNumber(i)) {
          let pushdata = null
          if (d2ggMap.has(i)) {
            pushdata = d2ggMap.get(i)
          } else {
            pushdata = new Date2GR(i)
          }
          if (intDiv(pushdata.day, 10000) !== year) {
            if (retyear.length !== 0) {
              ret[year] = retyear
            }
            retyear = []
            year = intDiv(pushdata.day, 10000)
          }
          retyear.push(pushdata)
        }
        if (retyear.length !== 0) {
          ret[year] = retyear
        }
        return ret
      }
    },
    filters: {
      'formatDate': (value) => {
        if (value) {
          return dateparse(value * 1000).join(' ')
        }
      }
    },
    mounted: function () {
      console.log(this.$router.currentPage)
    }
  }
</script>

<style>
  .container {
    display: flex;
    min-height: 100vh;
    min-width: 50em;
    justify-content: center;
    align-items: center;
    text-align: center;
    flex-direction: column;
    position: relative;
    width: 100%;
  }

  .ui-div-box {
    display: block;
    position: relative;
    width: 100%;
  }

  .ui-div-square {
    display: inline-flex;
    width: 100%;
    height: 100%;
    flex-direction: column;
  }

  .ui-div-square-sub {
    display: inline-flex;
    width: 100%;
  }

  .bggreen {
    background-color: rgb(198, 228, 139);
  }

  .bgred {
    background-color: red;
  }

  .bggrey {
    background-color: rgb(235, 237, 240);
  }

  .ui-div-eachyear {
    display: flex;
    position: relative;
    box-sizing: border-box;
    flex-direction: column;
    padding: .5em;
    margin: 1em;
  }

  .ui-div-eachyear-data {
    display: flex;
    height: 9em;
    position: relative;
    box-sizing: border-box;
    flex-direction: row;
  }

  .ui-div-eachday {
    display: inline-flex;
    width: 1em;
    height: 1em;
    margin: 1px;
  }

  .ui-div-datapart {
    display: inline-flex;
    height: 100%;
    position: relative;
    box-sizing: border-box;
    flex-direction: column;
    flex-wrap: wrap;
    padding: .5em;
  }

  .bggrey.month1,
  .bggrey.month3,
  .bggrey.month5,
  .bggrey.month7,
  .bggrey.month9,
  .bggrey.month11 {
    background-color: lightgray;
  }

  .errorReason {
    color: red;
  }

</style>
