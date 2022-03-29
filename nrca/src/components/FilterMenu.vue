<template>
  <div class="filter-menu">
    <div class="d-flex justify-space-between align-center">
<!-- 専用馬 -->
      <div class="total">
        <div>レッスン {{totalLessonCount}} 鞍</div>
        <div>約{{totalLessonCount * 30}}分騎乗</div>
        <div>出費 {{Math.ceil(totalExpenses / 1000)}} 千円</div>
      </div>
      <div class="reserve-filter">
        <div class="filter-type-box">専用馬</div>
        <div class="checkbox d-flex justify-center"
          :class="{ checked: enableReserve, unchecked: !enableReserve }"
          @mouseover="hoverReserve = true"
          @mouseout="hoverReserve = false"
          @click="onClickReserve"
        >
          <v-icon size="50"
            :color="(enableReserve || hoverReserve) ? '#ffffff' : '#a06090'"
          >mdi-check</v-icon>
        </div>
      </div>
<!-- レッスン時間 -->
    </div>
    <div class="time-length">
      <div class="filter-type-box" @click="timeLengthOpened = !timeLengthOpened">時間</div>
      <div class="d-flex">
        <div v-for="(item, idx) in totalCounts.time" :key="idx">
          <template v-if="timeLengthOpened">
            <div class="filter-option-label"
              :class="{ selected: item.selected }"
              @click="onClickItem('time', item)"
            >{{ item.name }}分（{{ getResutsCount('time', item) }}）</div>
          </template>
        </div>
      </div>
    </div>
<!-- インストラクター -->
    <div class="teacher">
      <div class="filter-type-box" @click.prevent="teacherOpened = !teacherOpened">担当</div>
      <div class="d-flex">
        <div v-for="(item, idx) in totalCounts.teacher" :key="idx">
          <template v-if="teacherOpened">
            <div class="filter-option-label d-flex" 
              :class="{ closed: !teacherOpened, selected: item.selected }"
              @click="onClickItem('teacher', item)"
            >{{ item.name }}（<span class="tcy">{{ getResutsCount('teacher', item) }}</span>）</div>
          </template>
        </div>
      </div>
    </div>
<!-- レッスン名 -->
    <div class="lesson-type">
      <div class="filter-type-box" @click.prevent="lessonOpened = !lessonOpened">レッスン名</div>
      <div class="d-flex">
        <div v-for="(item, idx) in totalCounts.lesson" :key="idx">
          <template v-if="lessonOpened">
            <div class="filter-option-label"
              :class="{ selected: item.selected, closed: !lessonOpened }"
              @click="onClickItem('lesson', item)"
            >{{ item.name }}（<span class="tcy">{{ getResutsCount('lesson', item) }}</span>）</div>
          </template>
        </div>
      </div>
    </div>
<!-- 馬名 -->
    <div class="horse-name">
      <div class="filter-type-box" @click="horseOpened = !horseOpened">馬名</div>
      <div class="d-flex flex-wrap">
        <div v-for="(item, idx) in totalCounts.horse" :key="idx">
          <template v-if="horseOpened">
            <div class="filter-option-label"
              :class="{ selected: item.selected, closed: !horseOpened }"
              @click="onClickItem('horse', item)"
            >{{ item.name }}（<span class="tcy">{{ getResutsCount('horse', item) }}</span>）</div>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'FilterMenu',
  props: ['totalCounts', 'totalLessonCount', 'filtered', 'totalExpenses'],
  data: () => {
    return {
      enableReserve: false,
      hoverReserve: false,
      timeLengthOpened: true,
      teacherOpened: true,
      lessonOpened: true,
      horseOpened: true,
      totalOutgiving: 777777
    }
  },

  computed: {
    // computedHeight () {
    //   // return this.$ref
    // }
  },

  methods: {
    onClickItem (prop, item) {
      this.$emit('click', prop, item)
      if (prop === 'reserve') {
        this.enableReserve = !this.enableReserve
      }
    },
    onClickReserve () {
      this.enableReserve = !this.enableReserve
      this.$emit('clickReserve')
    },
    getResutsCount (key, item) {
      if (this.filtered && this.filtered.length) {
        return this.filtered.filter(record => {
          for (const [idx, value] of Object.entries(record)) {
            if (idx !== key) {
              continue
            }
            if (value === item.name) {
              return true
            }
          }
          return false
        }).length
      }
      return 0
    }
  }
}
</script>
<style scoped lang="scss">
.filter-type-box, .filter-option-label {
  user-select: none; /* CSS3 */
  -moz-user-select: none; /* Firefox */
  -webkit-user-select: none; /* Safari、Chromeなど */
  -ms-user-select: none;
}
// 鞍数
.total {
  min-width: 130px;
  text-align: center;
  .number {
    font-size: 1.5em;
    color: #a06090;
  }
}
.filter-menu {
  max-width: 240px;
  padding: 10px;
  font-weight: bold;
  color: #a06090;
}
.tcy {
  text-combine-upright: all;
}
// フィルタ種類ボックス
.filter-type-box {
  color: #a06090;
  font-weight: bold;
  text-align: center;
  border: 2px solid #c06090;
  margin-top: 10px;
  max-width: 240px;
  &:hover {
    border: 2px solid #c06090;
    background-color: #c06090;
    color: white;
  }
}
.reserve-filter .filter-type-box {
  margin-top: 0;
  &:hover {
    border: 2px solid #c06090;
    background-color: white;
    color: #c06090;
  }
}
.checkbox {
  min-height: 60px;
  max-height: 60px;
  min-width: 90px;
  max-width: 90px;
  &.checked {
    background-color: #c06090;
    color: white
  }
  &.unchecked {
    background-color: white;
    color: #a06090;
    border-bottom: 2px solid #c06090 !important;
    border-left: 2px solid #c06090;
    border-right: 2px solid #c06090;
    &:hover {
      background-color: #a06090;
      color: white;
    }
  }
}
.time-length {
  .filter-option-label {
    text-align: center;
    padding-left: 0.5em;
  }
}
.lesson-type, .teacher, .horse-name {
  .filter-option-label {
    padding-top: 0.5em;
    writing-mode: vertical-rl;
    text-orientation: upright;
  }
}
.filter-option-label {
  color: #a06090;
  font-weight: bold;
  border: 2px solid #c06090;
  border-radius: 1em;
  margin: 0.5em 0.5em 0;
  text-align: left;
  &.selected {
    color: white;
    background-color: #c06090;
  }
  &:hover {
    border: 2px solid #a06090;
    background-color: #a06090;
    color: white;
  }
}

</style>