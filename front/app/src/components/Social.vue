<template>
  <social-sharing
    :url="url"
    :title="title"
    :description="description"
    hashtags="rDai, donate, opensource, ethereum"
    twitter-user="rDAI_dao"
    inline-template
    >
    <v-layout class="justify-center my-3">
      <network network="facebook">
        <v-icon class="mx-3 pointer">fab fa-facebook</v-icon>
      </network>
      <network network="linkedin">
        <v-icon class="mx-3 pointer">fab fa-linkedin</v-icon>
      </network>
      <network network="reddit">
        <v-icon class="mx-3 pointer">fab fa-reddit</v-icon>
      </network>
      <network network="twitter">
        <v-icon class="mx-3 pointer">fab fa-twitter</v-icon>
      </network>
      <network network="telegram">
        <v-icon class="mx-3 pointer">fab fa-telegram</v-icon>
      </network>
    </v-layout>
  </social-sharing>
</template>

<script>
export default {
  name: 'Social',
  props: ['url', 'title', 'description']
}
</script>

<style lang="css">
  .pointer{
    cursor : pointer;
  }
</style>
