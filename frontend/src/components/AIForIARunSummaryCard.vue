<template>
    <section>
        <table class="AIforIAruns-table">
          <thead>
            <tr>
                <th>image</th>
                <th>roi</th>
                <th>analysisBatch</th>
                <th>aiModelName</th>
                <th>colorChannelCount</th>
                <th>classLabel</th>
                <th>classAlias</th>
                <th>layerName</th>
                <th>areaPercentage</th>
                <th>countPercentage</th>
                <th>count</th>
                <th>area_mm2</th>
                <th>confidenceAvg</th>
                <th>contentType</th>
                <th>averageLengthUm</th>
                <th>averageWidthUm</th>
                <th>averageCircumferenceUm</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="row in iarun.iaSummary.items">
                <td>{{ row.image }}</td>
                <td>{{ row.roi }}</td>
                <td>{{ row.analysisBatch }}</td>
                <td>{{ row.aiModelName }}</td>
                <td>{{ row.colorChannelCount }}</td>
                <td>{{ row.classLabel }}</td>
                <td>{{ row.classAlias }}</td>
                <td>{{ row.layerName }}</td>
                <td>{{ row.areaPercentage }}</td>
                <td>{{ row.countPercentage }}</td>
                <td>{{ row.count }}</td>
                <td>{{ row.area_mm2 }}</td>
                <td>{{ row.confidenceAvg }}</td>
                <td>{{ row.contentType }}</td>
                <td>{{ row.averageLengtdUm }}</td>
                <td>{{ row.averageWidtdUm }}</td>
                <td>{{ row.averageCircumferenceUm }}</td>
            </tr>
          </tbody>
        </table>
    </section>
</template>


<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { aiforai } from '../api'
// import { type AIForIARunSummary, AIForIARunID } from '../models/AIForIARunSummary'
import type { AIForIARunSummary } from '../models/AIForIARunSummary'


// const props = defineProps<{
//   aiforiarunid: AIForIARunID
// }>()


console.log("AIForAIRunSummaryCard");
// const iarun = ref<AIForIARunSummary>();

// onMounted(async(): Promise<void> => {
//   console.log("onMounted");
//   aiforai.getAIForIARunSummary("something")
//     .then(async response => {
//       console.log("Got response:",response.data);
//       iarun.value = new AIForIARunSummary(response.data)
//     }).catch(err => {
//       console.log("Error in AIForAIRunSummaryCard::onMounted")
//       alert(err.message)
//       console.error(err)
//     })
// })
// onMounted(() => {
    console.log("onMounted");
    // iarun.value = new AIForIARunSummary(
    iarun = new AIForIARunSummary(
        {
          "iaSummary": {
            "items": [
              {
                "image": "string",
                "roi": "string",
                "analysisBatch": "string",
                "aiModelName": "string",
                "colorChannelCount": 0,
                "classLabel": "string",
                "classAlias": "string",
                "layerName": "string",
                "areaPercentage": 0,
                "countPercentage": 0,
                "count": 0,
                "area_mm2": 0,
                "confidenceAvg": 0,
                "contentType": "Unknown",
                "averageLengthUm": 0,
                "averageWidthUm": 0,
                "averageCircumferenceUm": 0
              }
            ]
          }
        }
    );
// })
console.log("iarun:",iarun);
</script>


<style scoped>
table th {
  background-color: var(--grey-light);
  padding: calc(var(--spacing) / 2);
  text-align: start;
  text-wrap: wrap;
}

table td {
  padding: calc(var(--spacing) / 2);
  text-wrap: wrap;
}

table tbody tr:hover {
  background-color: var(--primary-light);
}
</style>

