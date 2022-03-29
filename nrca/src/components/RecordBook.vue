<template>
  <div class="recordbook d-flex">
    <FilterMenu
      ref="filterMenu"
      class="filter-menu"
      :totalCounts="totalCounts"
      :filtered="filtered"
      :totalLessonCount="records.length"
      :totalExpenses="totalExpenses"
      @click="onClickItem"
      @clickReserve="onClickReserve"
    />
    <SearchResult
      class="record-view"
      :records="records"
      :totalCounts="totalCounts"
      :filtered="filtered"
      :shopping="shopping"
      :achievement="achievement"
    />
  </div>
</template>

<script>
// import axios from 'axios'
import FilterMenu from './FilterMenu'
import SearchResult from './SearchResult'
// import Records from './LessonRecords'
import _ from 'lodash'

export default {
  name: 'HelloWorld',

  components: {
    FilterMenu,
    SearchResult
    // Records
  },
  
  data: () => ({
    shizuoka: null,
    records: [],
    shopping: [],
    achievement: [],
    mode: null,
    horses: [],
    totalCounts: {
      'time': [],
      'teacher': [],
      'lesson': [],
      'reserve': [],
      'horse': []
    },
    filter: {
      'time': [],
      'teacher': [],
      'lesson': [],
      'reserve': [],
      'horse': []
    }
  }),

  computed: {
    totalExpenses () {
      if (this.shopping.length === 0) {
        return 0
      }
      const lesson = this.records.reduce((prev, current) => {
        const kura = current.time / 45
        const isHoliday = current.holiday === '祝'
        const isWeekend = ['土', '日'].some(daytype => daytype === current.daytype)
        const ridingFee = {
          weekday: 1650,
          weekend: 2200
        }
        if (isHoliday || isWeekend) {
          return prev + ridingFee.weekend * kura
        } else {
          return prev + ridingFee.weekday * kura
        }
      }, 0)
      const shopping = this.shopping.reduce((prev, current) => {
        return prev + current.amount
      }, 0)
      const insurance = 220 * (new Set(this.records.map(lesson => this.getDate(lesson)))).size
      return shopping + lesson + insurance
    },
    filtered () {
      const tmp = this.totalCounts.reserve.find(item => item.name !== "")
      const reserveEnabled = tmp && tmp.selected 
      const filtered =  Object.entries(this.totalCounts).map(([ key, list ]) => {
        const selectedOptions = list.filter(value => value.selected)
        if (selectedOptions.length === 0) {
          return this.records
        }
        if (!reserveEnabled && key === 'reserve') {
          return this.records
        }
        return this.records.filter(item => {
          return selectedOptions.some(value => item[key] === value.name)
        })
      }).reduce((prev, current) => {
        return _.intersectionBy(prev, current, 'id')
      }, [...this.records])
      return filtered
    },
    // recordsSinceDate () {
    //   const formatDate = dt => {
    //     var y = dt.getFullYear();
    //     var m = ('00' + (dt.getMonth()+1)).slice(-2);
    //     var d = ('00' + dt.getDate()).slice(-2);
    //     return (y + '-' + m + '-' + d);
    //   }
    //   if (!this.records) {
    //     return formatDate(new Date())
    //   }
    //   const sinceDate = Date.parse(this.records.slice(0, 1).date)
    //   console.log({sinceDate})
    //   return formatDate(sinceDate)
    // },
    totalNumberRides () {
      if (!this.records) {
        return 0
      }
      return this.records.filter(record => {
        return record.lesson.length > 0
      }).length
    },
    modeStates () {
      return { simple: 0, detail: 1, emoji: 2, record: 3 }
    },
    isSimple () {
      return this.mode === this.modeStates.simple
    },
    isDetail () {
      return this.mode === this.modeStates.detail
    },
    isDots () {
      return this.mode === this.modeStates.emoji
    },
    isRecord () {
      return this.mode === this.modeStates.record
    }
  },

  watch: {
    // totalCounts: {
    //   handler (counts) {
    //     console.log({ counts })
    //   }
    // },
    // deep: true
  },

  mounted () {
    fetch(
      'https://script.google.com/macros/s/AKfycbzEaEjzjYnawZ7eA4a70Zj0TMWecON8FH0F5RFicX8rac6PTSKZABfF5YAV9xrXMqve/exec',
    )
    .then(res => res.json())
    .then(result => {
      // console.log({result})
      // achievement
      this.achievement = [...(result.achievement)]
      const achievementProps = [
        { ja: '日付', en: 'date' },
        { ja: '実績', en: 'achievement' }
      ]
      for (const item of this.achievement) {
        for (const prop of achievementProps) {
          this.$set(item, prop.en, item[prop.ja])
        }
      }
      for (let i=0; i<this.achievement.length; i++) {
        this.$set(this.achievement[i], 'id', i) 
        this.$set(this.achievement[i], 'datatype', 'achievement') 
      }
      // shopping
      this.shopping = [...(result.shopping)]
      const shoppingProps = [
        { ja: '日付', en: 'date' },
        { ja: '種類', en: 'type' },
        { ja: '明細', en: 'goods' },
        { ja: '価格', en: 'amount' }
      ]
      for (const item of this.shopping) {
        for (const prop of shoppingProps) {
          this.$set(item, prop.en, item[prop.ja])
        }
      }
      for (let i=0; i<this.shopping.length; i++) {
        this.$set(this.shopping[i], 'id', i) 
        this.$set(this.shopping[i], 'datatype', 'shopping') 
      }
      // records
      this.records = [...(result.lesson)]
      const recordsProps = [
        { ja: 'レッスン時間', en: 'time' },
        { ja: '担当', en: 'teacher' },
        { ja: 'コメント', en: 'comment' },
        { ja: 'レッスン名', en: 'lesson' },
        { ja: '場所', en: 'place' },
        { ja: '天候', en: 'weather' },
        { ja: '専用馬', en: 'reserve' },
        { ja: '日付', en: 'date' },
        { ja: '曜日', en: 'daytype' },
        { ja: '祝日', en: 'holiday' },
        { ja: '終了時刻', en: 'end' },
        { ja: '開始時刻', en: 'start' },
        { ja: '馬匹名', en: 'horse' }
      ]
      for (const item of this.records) {
        for (const prop of recordsProps) {
          this.$set(item, prop.en, item[prop.ja])
        }
      }
      this.records.sort((a, b) => {
        if (a.date < b.date) return +1
        if (a.date > b.date) return -1
        if (a.date === b.date) {
          if (a.start > b.start) return +1
          if (a.start < b.start) return -1 
        }
        return 0
      })
      for (let i=0; i<this.records.length; i++) {
        this.$set(this.records[i], 'id', i) 
        this.$set(this.records[i], 'datatype', 'records')
      }
      this.calcTotalCount(result)
    });
  },

  methods: {
    getDate (item) {
      const date = new Date(item.date)
      return `${date.getMonth()+1}/${date.getDate()}(${item.daytype})`
    },
    onClickReserve () {
      for (const item of this.totalCounts.reserve) {
        if (item.name === '') {
          this.$set(item, 'selected', false)
        } else {
          this.$set(item, 'selected', !item.selected)
        }
      }
    },
    onClickItem (prop, item) {
      const clicked = this.totalCounts[prop].find(value => value.name === item.name)
      // console.log({ clicked })
      this.$set(clicked, 'selected', !clicked.selected)
    },
    calcTotalCount () {
      const countTargetProps = [
        'time', 'teacher', 'lesson', 'reserve', 'horse'
      ]
      for (const target of countTargetProps) {
        for (const record of this.records) {
          if (this.totalCounts[target].some(item => item.name === record[target])) {
            continue
          }
          this.totalCounts[target].push({
            name: record[target],
            count: this.records.filter(x => x[target] === record[target]).length,
            selected: false
          })
        }
      }
      this.totalCounts.horse.sort((a, b) => {
        const _a = a.name
        const _b = b.name
        if (_a.length > _b.length) return +1
        if (_a.length < _b.length) return -1
        else return 0
      })
    },
    lessonClass (lesson) {
      return {
        'basic-bc': lesson === 'ベーシックBC',
        'basic-a': lesson === 'ベーシックA',
        'basic-galop-ab': lesson === 'ベーシック駈歩AB'
      }
    },
    lessonName (lesson) {
      if (lesson === 'ベーシックBC') {
        return  'BC'
      }
      if (lesson === 'ベーシックA') {
        return  'A'
      }
      if (lesson === 'ベーシック駈歩AB') {
        return  '駈歩AB'
      }
      return ''
    },
    onSortYounger () {
      this.shizuoka.forEach(club => {
        club.belonging.sort((a, b) => {
          const _a = this.date2age(a.birthday)
          const _b = this.date2age(b.birthday)
          if (_a > _b) return 1
          if (_a < _b) return -1
          return 0
        })
      })
    },
    onSortColor () {
      this.shizuoka.forEach(club => {
        club.belonging.sort((a, b) => {
          const _a = a.color
          const _b = b.color
          if (_a > _b) return 1
          if (_a < _b) return -1
          return 0
        })
      })
    },
    date2age (date) {
      const today = new Date()
      const birthDate = new Date(date)
      let age = today.getFullYear() - birthDate.getFullYear()
      const m = today.getMonth() - birthDate.getMonth()
      if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age --
      }
      return age
    },
    rgb2emojiStyle (rgb) {
      return {
        color: 'transparent',
        textShadow: `0 0 0 ${rgb}` 
      }
    },
    rgb2style (rgb) {
      const hex2rgb = hex => {
        if (hex.slice(0, 1) === "#" ) {
          hex = hex.slice(1)
        }
        return [
          hex.slice(0, 2),
          hex.slice(2, 4),
          hex.slice( 4, 6 )
        ].map(str => parseInt(str, 16))
      }
      const rgbAverage = hex2rgb(rgb).reduce((prev, current) => {
        return prev += (current / 3)
      }, 0)
      const color = rgbAverage > 128 ? '#333333' : '#cccccc'
      return {
        backgroundColor: rgb,
        color: color
      }
    },
    color2rgb (color) {
      const list = [
        { color: '鹿毛', rgb: ['#664032'] },
        { color: '鹿粕毛', rgb: ['#664032'] },
        { color: '鹿駁毛', rgb: ['#664032'] },
        { color: '駁鹿毛', rgb: ['#664032'] },

        { color: '黒鹿毛', rgb: ['#332016'] },
        { color: '青鹿毛', rgb: ['#1f222d'] },
        
        { color: '青毛', rgb: ['#272830'] },
        { color: '青粕毛', rgb: ['#272830'] },
        
        { color: '芦毛', rgb: ['#cbd3dd'] },
        
        { color: '栗毛', rgb: ['#c69e6e'] },
        { color: '栗粕毛', rgb: ['#c69e6e'] },
        { color: '栗駁毛', rgb: ['#c69e6e'] },
        { color: '駁栗毛', rgb: ['#c69e6e'] },
        { color: '尾花栗毛', rgb: ['#c69e6e', '#e4cc9e'] },
        
        { color: '栃栗毛', rgb: ['#67493a'] },
        { color: '白毛', rgb: ['#eeeeee'] },
        
        { color: '河原毛', rgb: ['#a8804d'] },
        { color: '月毛', rgb: ['#d5ae80', '#c8bca0'] },
        { color: '小班', rgb: ['#cabeae'] },
        { color: '粕毛', rgb: ['#ebd7d6'] },
        { color: '薄墨毛', rgb: ['#3b3a3c'] }
      ]
      const result = list.find(item => {
        return color === item.color 
      })
      return result !== undefined ? result.rgb : null
    }
  }
}
</script>

<style lang="scss" scoped>
.recordbook {
  display: flex;
  height: calc(100vh - 64px);
  overflow: hidden;
}
.filter-menu {
  min-width: 240px;
  overflow-y: scroll;  
  -ms-overflow-style: none;    /* IE, Edge 対応 */
  scrollbar-width: none;       /* Firefox 対応 */
}
.filter-menu::-webkit-scrollbar {  /* Chrome, Safari 対応 */
  display: none;
}
.record-view {
  flex: auto;
  overflow-y: scroll;  
  height: 100vh;
  -ms-overflow-style: none;    /* IE, Edge 対応 */
  scrollbar-width: none;       /* Firefox 対応 */
}
.record-view::-webkit-scrollbar {  /* Chrome, Safari 対応 */
  display: none;
}
// .total-number-rides {
//   color: white;
//   height: 4em;
//   line-height: 6em;
//   font-size: 2em;
//   .number {
//     font-size: 4em;
//     font-weight: bold;
//     letter-spacing: -0.05em;
//   }
// }
// .lesson {
//   width: 3em;
//   height: 3em;
//   border-radius: 1.5em;
//   text-align: center;
//   line-height: 1em;
//   &.basic-bc {
//     background-color: #669933;
//     color: white;
//     font-weight: bold;
//   }
//   &.basic-a {
//     background-color: #cc66aa;
//     color: white;
//     font-weight: bold;
//   }
//   &.basic-galop-ab {
//     background-color: #aa33ee;
//     color: white;
//     font-weight: bold;
//   }
// }
// .map {
//   width: 100vw;
//   height: 100vh;
// }
body {
  font-family: "Helvetica Neue",
    Arial,
    "Hiragino Kaku Gothic ProN",
    "Hiragino Sans",
    Meiryo,
    sans-serif;
    font-size: 12pt;
}
// .btn {
//   border: 1px solid gray;
// }
// .club {
//   font-size: 0.8em;
//   color: #eeeeee;
// }
// .emoji {
//   .color {
//     font-size: 2em;
//   }
// }
// .simple {
//   .name {
//     color: white;
//   }
// }
// .detail {
//   .horse {
//     outline: 1px solid gray;
//     width: 12em;
//     height: 3.6em;
//     white-space: pre-wrap;
//     background-color: #eeeeee;
//     line-height: 1em;
//   }
//   .age {
//     font-size: 0.8em;
//   }
//   .color {
//     color: #dddddd;
//     height: 4.8em;
//     width: 1.2em;
//     font-weight: bold;
//     letter-spacing: 0.1em;
//     font-size: 0.7em;
//     writing-mode: vertical-rl;
//   }
//   .name {
//     font-weight: bold;
//   }
// }
</style>
