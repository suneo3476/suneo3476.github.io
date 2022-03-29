<template>
  <div class="record">
    <div class="horse-list">
      <div class="date-box"
        v-for="(date, idx) in filteredDates" :key="['date',idx].join('-')"
      >
        <template v-if="hasAnyEvent(date)">
  <!-- 日付 -->
          <div class="header d-flex align-center justify-content-start">
            <div class="date">{{date}}</div>
            <template v-if="filteredEachDate.lesson[date].length">
              <div class="eventtype"></div>
              <div class="start">時刻</div>
              <div class="teacher">担当</div>
              <div class="lesson">レッスン</div>
              <div class="horse">馬名</div>
            </template>
          </div>
  <!-- レッスン -->
          <div>
            <div class="item lesson-item d-flex algin-center justify-content-start"
              v-for="(lesson, lessonKey) in filteredEachDate.lesson[date]" :key="['lesson',lessonKey].join('-')"
            >
              <div class="date"></div>
              <div class="eventtype">🥕</div>
              <div class="start">{{getStart(lesson)}}</div>
              <div class="teacher">{{lesson.teacher}}</div>
              <div class="lesson">{{lesson.lesson}}</div>
              <div class="horse">
                {{lesson.horse}}<span v-if="lesson.reserve.length">【指名】</span>
              </div>
            </div>
    <!-- 買い物 -->
            <div>
              <div class="item lesson-item d-flex algin-center justify-content-start"
                v-for="(shopping, shoppingKey) in filteredEachDate.shopping[date]"
                :key="['lesson',shoppingKey].join('-')"
              >
                <div class="date"></div>
                <div class="eventtype">💰</div>
                <div class="achievement">【出費】＜{{shopping.type}}＞{{shopping.goods}}：{{shopping.amount}}円</div>
              </div>
            </div>
    <!-- 実績 -->
            <div>
              <div class="item lesson-item d-flex algin-center justify-content-start"
                v-for="(achievement, achievementKey) in filteredEachDate.achievement[date]"
                :key="['lesson',achievementKey].join('-')"
              >
                <div class="date"></div>
                <div class="eventtype">💎</div>
                <div class="achievement">【実績】{{achievement.achievement}}</div>
              </div>
            </div>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'RidingCountOnHorse',
  props: {
    records: { type: Array, require: true },
    totalCounts: { type: Object, require: true },
    filtered: { type: Array, require: true },
    shopping: { type: Array, require: true },
    achievement: { type: Array, require: true }
  },

  data () {
    return {
    }
  },

  computed: {
    mixed () {
      const mixed = []
      mixed.push([...this.filtered])
      mixed.push([...this.shopping])
      mixed.push([...this.achievement])
      return mixed.sort((a, b) => {
        if (a.date > b.date) return +1
        if (a.date < b.date) return -1
        if (a.date === b.date) return 0
      })
    },
    filteredDates () {
      const mapped = []
      mapped.push(...this.filtered.map(item => {
        return item
      }))
      if (this.shopping) {
        mapped.push(...this.shopping.map(item => {
          return item
        }))
      }
      if (this.achievement) {
        mapped.push(...this.achievement.map(item => {
          return item
        }))
      }
      mapped.sort((a,b) => {
        const _a = a.date
        const _b = b.date
        if (_a < _b) return +1
        if (_a > _b) return -1
        else return 0
      })
      return Array.from(new Set(mapped.map(_ => this.getMonthDate(_))))
    },
    filteredEachDate () {
      const obj = {
        lesson: [],
        shopping: [],
        achievement: []
      }
      console.log(this.filteredDates)
      for (const date of this.filteredDates) {
        // console.log({date})
        this.$set(obj.lesson, date, this.filtered.filter(item => {
          // console.log(this.getMonthDate(item))
          return this.getMonthDate(item) === date
        }))
        if (this.shopping) {
          this.$set(obj.shopping, date, this.shopping.filter(item => {
            // console.log(this.getMonthDate(item))
            return this.getMonthDate(item) === date
          }))
        }
        if (this.achievement) {
          this.$set(obj.achievement, date, this.achievement.filter(item => {
            // console.log(this.getMonthDate(item))
            return this.getMonthDate(item) === date
          }))
        }
      }
      console.log(this.shopping)
      console.log(this.achievement)
      console.log(obj.shopping)
      console.log(obj.achievement)
      return obj
    }
  },

  methods: {
    hasAnyEvent (date) {
      console.log(date, this.filteredEachDate.lesson[date].length, this.filteredEachDate.shopping[date].length, this.filteredEachDate.achievement[date].length)
      return this.filteredEachDate.lesson[date].length ||
      this.filteredEachDate.shopping[date].length ||
      this.filteredEachDate.achievement[date].length
    },
    getMonthDate (item) {
      const date = new Date(item.date)
      return `${date.getMonth()+1}/${date.getDate()}`
    },
    getMonthDateDaytype (item) {
      const date = new Date(item.date)
      return `${date.getMonth()+1}/${date.getDate()}(${item.daytype})`
    },
    getStart (item) {
      const date = new Date(item.start)
      return `${date.getHours()}:${date.getMinutes()}`
    }
  }
}
</script>
<style lang="scss" scoped>
.achievement {
  min-width: 400px;
  max-width: 400px;
}
.date-box {
  border-top: 2px solid #a06090;
}
.heading {
  font-weight: bold;
}
.horse-list {
  // border: 2px solid #a06090;
  line-height: 2em;
  .header {
    font-weight: bold;
  }
  .btn {
    cursor: pointer;
    text-decoration: underline;
    &:hover {
      color: #a06090;
    }
  }
  .item {
    // border-top-left-radius: 1em;
    // border-bottom-left-radius: 1em;
    // border: 2px solid #a06090;
    line-height: 2em;
    min-height: 2em;
    font-weight: bold;
    // padding: 0 1em;
    &.odd {
      background-color: #a06090;
      color: white;
    }
    text-overflow: ellipsis;
  }
}
.date {
  min-width: 50px;
  max-width: 50px;
}
.eventtype {
  max-width: 20px;
  min-width: 20px;
}
.start {
  text-align: right;
  margin-left: 20px;
  min-width: 40px;
  max-width: 40px;
}
.teacher {
  margin-left: 20px;
  min-width: 40px;
  max-width: 40px;
}
.lesson {
  margin-left: 10px;
  min-width: 140px;
  max-width: 140px;
}
.horse {
  min-width: 220px;
  max-width: 220px;
}
.reserve {
  text-align: center;
  min-width: 50px;
  max-width: 50px;
}
</style>