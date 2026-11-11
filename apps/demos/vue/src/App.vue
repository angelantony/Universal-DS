<script setup lang="ts">
import { ref } from 'vue';
import { UdsButton } from '@uds/vue';

const count = ref(0);
const submitted = ref('no');
const disabledCount = ref(0);

function onSubmit(event: Event): void {
  event.preventDefault();
  submitted.value = 'yes';
}
</script>

<template>
  <UdsButton id="label-button" variant="outline" tone="danger" @click="count += 1">Save</UdsButton>
  <p id="count">{{ count }}</p>
  <form id="demo-form" @submit="onSubmit">
    <input id="title" name="title" />
    <UdsButton id="submit-button" type="submit">Submit</UdsButton>
    <UdsButton id="reset-button" type="reset">Reset</UdsButton>
  </form>
  <p id="submitted">{{ submitted }}</p>
  <UdsButton id="disabled" :disabled="true" @click="disabledCount += 1">Disabled</UdsButton>
  <p id="disabled-count">{{ disabledCount }}</p>
</template>
