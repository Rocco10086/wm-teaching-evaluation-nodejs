<template>
  <div class="p-x-20">
    <!-- @on-selection-change="selectData" -->
    <Table
      ref="tableRef"
      class="table-customize"
      :columns="columns"
      :data="tableData"
      :loading="tableLoading"
    >
      <template
        slot="subjectName"
        slot-scope="{row}"
      >
        <div
          v-for="(item, index) in row.courses"
          :key="index"
        >
          <div>{{ item.title }}</div>
          <div>{{ item.courseCode }}</div>
          <!-- {{item.title}}{{`(${item.courseCode})`}} -->
        </div>
      </template>
      <template
        slot="college"
        slot-scope="{row}"
      >
        <div
          v-for="(item, index) in row.courses"
          :key="index"
        >
          <div>{{ item.facultyName }}</div>
          <div>{{ item.facultyEnName }}</div>
        </div>
      </template>
      <template
        slot="teacher"
        slot-scope="{row}"
      >
        <div>{{ row.teacherName }}</div>
        <div>{{ `(${row.teacheStaffNo})` }}</div>
      </template>
      <template
        slot="recycleIssued"
        slot-scope="{row}"
      >
        <div>{{ row.finishedNumber }}/{{ `${row.pushNumber}` }}</div>
      </template>
      <template
        slot="recoveryRate"
        slot-scope="{row}"
      >
        <div>{{ addPercentSign(row.finishedPercentage) }}</div>
        <!-- <div>{{addPercentSign(0.07)}}</div> -->
      </template>
      <template
        slot="date"
        slot-scope="{row}"
      >
        <div>{{ dateFormat(row.releaseTime) }}</div>
        <div>{{ dateFormat(row.expireTime) }}</div>
      </template>
      <template
        slot="questionnaireStatus"
        slot-scope="{row}"
      >
        <div :class="statusColor(row.surveyStatus)">
          {{ mapperSurveyStatus(row.surveyStatus) }}
        </div>
      </template>
      <template #admIntakeCount="{row}">
        <div
          v-for="item in Object.keys(row.admIntakeCount)"
          :key="item"
        >
          {{ `${item}:${row.admIntakeCount[item]}` }}
        </div>
      </template>
      <!-- slot-scope="{row}" -->
      <template
        slot="operating"
        slot-scope="{row}"
      >
        <div>
          <!-- 查看 -->
          <!-- v-if="can(P => P.evaluationList.recordView)" -->
          <TextButton
            v-if="$checkAuthority($route.name, 'recordView')"
            class="m-x-5"
            @click="JumptoDetail(row.id)"
          >
            <span>{{ $t('btn.view') }}</span>
          </TextButton>
          <!-- 统计 -->
          <!-- v-if="can(P => P.evaluationList.recordStatistics)" -->
          <TextButton
            v-if="$checkAuthority($route.name, 'recordStatistics')"
            class="m-x-5"
            @click="JumptoStatistics(row.id)"
          >
            <span>{{ $t('btn.statistics') }}</span>
          </TextButton>
        </div>
      </template>
    </Table>
  </div>
</template>

<script>
import _ from 'lodash';
import { format } from 'date-fns';
import TextButton from '@components/common/we-text-button.vue';
import { routerName } from '@consts/index';
import createColumns from './columns-index';

export default {
  components: {
    TextButton,
  },
  props: {
    tableData: {
      type: Array,
      default: () => [],
    },
    tableLoading: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      columns: createColumns(this),
    };
  },
  methods: {
    statusColor(status) {
      const mapper = {
        DEFAULT: 'color-gray',
        BEEXPIRED: 'color-gray',
        PROCESSING: 'color-blue',
      };
      return mapper[status] || mapper.DEFAULT;
    },

    mapperSurveyStatus(status) {
      const mapper = {
        EXPIRED: this.$t('evaluationList.status.BEEXPIRED'),
        PROCESSING: this.$t('evaluationList.status.PROCESSING'),
      };

      return mapper[status];
    },

    addPercentSign(rate) {
      const filterList = [0, '', null, undefined];
      const f = filterList.includes(rate);

      if (f) {
        return 0;
      }
      // return `${parseFloat(rate) * 100}%`;
      return `${_.round(parseFloat(rate) * 100, 2)}%`;
    },
    dateFormat(val) {
      return format(new Date(val), 'yyyy/MM/dd HH:mm');
    },

    // 跳轉至詳情頁
    JumptoDetail(id) {
      const { name } = this.$route;
      let jumpRouterName = '';
      if (name === routerName.EVALUTIONLIST) {
        jumpRouterName = routerName.EVALUTIONDETAIL;
      }
      if (name === routerName.EVALUTIONNIGHT) {
        jumpRouterName = routerName.EVALUTIONDETAILNIGHT;
      }
      if (name === routerName.POSTGRADUATEEVALUTIONLIST) {
        jumpRouterName = routerName.POSTGRADUATEEVALUTIONDETAIL;
      }
      this.$router.push({ name: jumpRouterName, query: { id } });
    },

    // 跳轉至統計頁
    JumptoStatistics(id) {
      const { name } = this.$route;
      let jumpRouterName = '';
      if (name === routerName.EVALUTIONLIST) {
        jumpRouterName = routerName.EVALUTIONSTATISTICS;
      }
      if (name === routerName.EVALUTIONNIGHT) {
        jumpRouterName = routerName.EVALUTIONSTATISTICSNIGHT;
      }
      if (name === routerName.POSTGRADUATEEVALUTIONLIST) {
        jumpRouterName = routerName.POSTGRADUATEEVALUTIONSTATISTICS;
      }
      this.$router.push({ name: jumpRouterName, query: { id } });
      // this.$router.push({ name: 'EvalutionStatistics', query: { id } });
    },
  },
};
</script>

<style lang="less" scoped>
@import '~@styles/table-customize.less'; /*引入公共table样式*/

.color-gray{
  color: #888888;
}
.color-blue{
  color: #365AA4;
}
</style>
