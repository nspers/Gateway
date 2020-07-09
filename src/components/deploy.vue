<template>
  <div class="deploy clearfix">
    <div class="leftNav" :class="{ 'active': count }" style="color:#fff;">
      <img src="../assets/img/logo.png" height="64" width="190" />
      <Menu
        v-if="!$store.state.toggle"
        ref="side_menu"
        :theme="theme1"
        @on-select="change_sub_router"
        @on-open-change="test"
        :active-name="subPath"
        :open-names="tabName"
        accordion
      >
        <div v-for="(item, index) in menu" :key="index">
          <Submenu v-if="item.childList" :name="item.id">
            <template slot="title">
              <Icon type="md-globe" v-if="item.id == 1" />
              <Icon type="ios-print-outline" v-if="item.id == 2" />
              <Icon type="ios-contacts" v-if="item.id == 3" />
              <Icon type="ios-switch" v-if="item.id == 4" />
              <Icon type="ios-color-filter-outline" v-if="item.id == 255" />
              <span>{{item.name}}</span>
            </template>
            <div v-for="(subItem, i) in item.childList" :key="index + i">
              <Submenu v-if="subItem.childList" :name="subItem.id">
                <template slot="title">
                  <Icon />
                  <span>{{subItem.name}}</span>
                </template>
                <MenuItem
                  v-for="(threeItem, k) in subItem.childList"
                  :name="threeItem.url"
                  :key="index + i + k"
                >
                  <span>{{threeItem.name}}</span>
                </MenuItem>
              </Submenu>
              <MenuItem v-else :name="subItem.url">
                <Icon />
                <span>{{subItem.name}}</span>
              </MenuItem>
            </div>
          </Submenu>
          <MenuItem v-else :name="item.url">
            <Icon />
            <span>{{item.name}}</span>
          </MenuItem>
        </div>
      </Menu>
      <div v-else class="toggled-menu">
        <div class="menu-logo"></div>

        <Dropdown
          v-for="(item, index) in menu"
          :key="index"
          @on-click="change_sub_router"
          placement="right-start"
        >
          <DropdownMenu v-if="item.childList" slot="list">
            <div v-for="(subItem, i) in item.childList" :key="index + i">
              <Dropdown v-if="subItem.childList" placement="right-start">
                <DropdownItem :name="subItem.url" :selected="menuID_2==subItem.id">
                  {{subItem.name}}
                  <Icon type="ios-arrow-forward"></Icon>
                </DropdownItem>
                <DropdownMenu
                  v-for="(threeItem, k) in subItem.childList"
                  :key="index + i + k"
                  slot="list"
                >
                  <DropdownItem
                    :name="threeItem.url"
                    :selected="menuID_3==threeItem.id"
                  >{{threeItem.name}}</DropdownItem>
                </DropdownMenu>
              </Dropdown>
              <DropdownItem
                v-else
                :name="subItem.url"
                :selected="menuID_2==subItem.id"
              >{{subItem.name}}</DropdownItem>
            </div>
          </DropdownMenu>
          <a href="javascript:void(0)" :title="item.name" :class="{menuSelected:menuID_1==item.id}">
            <Icon type="md-globe" v-if="item.id == 1" />
            <Icon type="ios-print-outline" v-if="item.id == 2" />
            <Icon type="ios-contacts" v-if="item.id == 3" />
            <Icon type="ios-switch" v-if="item.id == 4" />
            <Icon type="ios-color-filter-outline" v-if="item.id == 255" />
          </a>
        </Dropdown>
      </div>
    </div>
    <div class="right">
      <Nav></Nav>
      <p class="nav_p">{{$store.state.index}} > {{$store.state.subtitle}}</p>
      <keep-alive>
        <transition name="fade" mode="out-in">
          <router-view />
        </transition>
      </keep-alive>
      <div
        class="copyright"
      >Copyright © 2019 SHUZHI · Powered by Eels. All Rights Reserved. Current version is 1.0.</div>
    </div>
  </div>
</template>
<script>
import Nav from "./header.vue";

export default {
  name: "App",
  components: {
    Nav
  },
  data() {
    return {
      menuID_1: -1,
      menuID_2: -1,
      menuID_3: -1,
      theme1: "dark",
      subPath: "",
      index: this.$store.state.index,
      subtitle: this.$store.state.subtitle,
      menu: JSON.parse(sessionStorage.menu),
      routerArry: {
        255: ["device", "command"],
        1: ["config"],
        2: ["tecnon", "spon", "abloomy", "lonbon"],
        3: ["use"],
        4: ["dictionary", "dictionarygroup"],
        6: ["log"]
      }
    };
  },
  sockets: {
    connect() {
      console.log("socket connected");
    }
  },
  computed: {
    tabName() {
      return [this.menuID_1, this.menuID_2, this.menuID_3];
    },
    count() {
      return this.$store.state.toggle;
    }
  },
  created() {
    this.subPath = this.$router.history.current.name;
    this.routerChanged();
  },
  mounted() {},
  methods: {
    change_sub_router(e) {
      var self = this;
      this.$router.push({ name: e });
      this.subPath = e;
      this.routerChanged();
    },
    routerChanged() {
      var self = this;
      let newRouter = JSON.parse(sessionStorage.router);

      // 查找选中菜单相关id
      findMenu: for (var i = 0; i < self.menu.length; i++) {
        if (self.menu[i].url == self.subPath) {
          self.menuID_1 = self.menu[i].id;
          break findMenu;
        }
        if (self.menu[i].childList) {
          for (var j = 0; j < self.menu[i].childList.length; j++) {
            if (self.menu[i].childList[j].url == self.subPath) {
              self.menuID_1 = self.menu[i].id;
              self.menuID_2 = self.menu[i].childList[j].id;

              self.$store.state.index = self.menu[i].name;
              self.$store.state.subtitle = self.menu[i].childList[j].name;
              break findMenu;
            }
            if (self.menu[i].childList[j].childList) {
              for (
                var k = 0;
                k < self.menu[i].childList[j].childList.length;
                k++
              ) {
                if (
                  self.menu[i].childList[j].childList[k].url == self.subPath
                ) {
                  self.menuID_1 = self.menu[i].id;
                  self.menuID_2 = self.menu[i].childList[j].id;
                  self.menuID_3 = self.menu[i].childList[j].childList[k].id;

                  self.$store.state.index = self.menu[i].childList[j].name;
                  self.$store.state.subtitle = self.menu[i].childList[j].childList[k].name;
                  break findMenu;
                }
              }
            }
          }
        }
      }
    },
    test(e) {
      // this.tabName = e
      // this.$socket.emit('test', 123);
    },
    signout() {
      sessionStorage.removeItem("token");
      this.$router.push({ name: "login", params: { reload: 1 } });
    }
  }
};
</script>
