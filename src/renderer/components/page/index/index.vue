<template>
	<div>
		<div class="container">
			<div :class="[showWebView?'slide':'full','search-box']">
				<div v-if="showWebView" class="option-box">
					<i class="el-icon-arrow-left" v-on:click="handleBack"></i>
					<i class="el-icon-arrow-right" v-on:click="handleForward"></i>
				</div>
				<el-input placeholder="请输入内容" v-model="input" class="input-with-select">
					<el-select v-model="by" slot="prepend" placeholder="请选择">
						<el-option label="在线" value="online"></el-option>
						<el-option label="下载" :disabled="switchType==='video'?false:true" value="download"></el-option>
					</el-select>
					<el-button slot="append" icon="el-icon-search" v-on:click="handleSerach"></el-button>
				</el-input>
				<div v-if="showWebView" class="switch-box">
					<el-button-group>
						<el-button :type="switchType==='video'?'primary':''" v-on:click="handleSwitch('video')">影视</el-button>
						<el-button :type="switchType==='comic'?'primary':''" v-on:click="handleSwitch('comic')">漫画</el-button>
						<el-button :type="switchType==='anime'?'primary':''" v-on:click="handleSwitch('anime')">动漫</el-button>
					</el-button-group>
				</div>
			</div>
			<webview ref="video" v-show="videoWebView&&switchType==='video'" :src="videourl" class="webview" allowpopups plugins
			 autosize></webview>
			<webview ref="comic" v-show="comicWebView&&switchType==='comic'" :src="comicurl" class="webview" allowpopups plugins
			 autosize></webview>
			<webview ref="anime" v-show="animeWebView&&switchType==='anime'" :src="animeurl" class="webview" allowpopups plugins
			 autosize></webview>
		</div>
		<el-dialog title="指南" :visible.sync="showGuide">
			<p>
				资源来自国内各大网站，放心食用<br />
				搜索框中输入剧名即可搜索<br />
				<br />
				影视：日剧（支持在线及下载）<br />
				漫画：大部分日漫，美漫都可搜索，除了被禁的太狠的，东京食尸鬼啥的（仅支持在线）<br />
				动漫：大部分日漫，不过尽量还是支持正版叭（仅支持在线）<br />
				<br />
				部分依赖flash的资源在mac os下可能会无法播放
			</p>
			<div>版本号:1.0.0 beta</div>
		</el-dialog>
	</div>
</template>

<script>
	import {
		Notification
	} from 'element-ui';
	import {
		OPTIONS,
		WEBSITE,
	} from './config.js';
	import windowUtils from '../../../../main/api/windowUtils.js';
	// console.log(windowUtils.getScreen())
	export default {
		name: 'Index',
		data() {
			return {
				url: '',
				showWebView: false,
				videoWebView: false,
				comicWebView: false,
				animeWebView: false,
				showGuide: true,
				input: '',
				by: 'online',
				switchType: 'video',
				videourl: ' ',
				comicurl: ' ',
				animeurl: ' ',
			};
		},
		watch: {
			by(val, old) {
				const keywords = this.$data.input;
				this.loadSite(keywords);
			},
			switchType(val, old) {
				const keywords = this.$data.input;
				console.log(keywords);
				this.loadSite(keywords);
			},
		},
		mounted() {
			this.initSite();
		},
		methods: {
			initSite() {
				const ops = ['video', 'comic', 'anime'];
				ops.map((v) => {
					const webview = this.$refs[v];
					// 注册事件
					webview.addEventListener('dom-ready', () => {
						this.$data.showWebView = true;
						this.filter();
					})
					webview.addEventListener('new-window', (e) => {
						// console.log("new-window")
						webview.loadURL(e.url);
					})
					webview.addEventListener('media-started-playing', (e) => {
						windowUtils.maxWindow(true);
					})
				})
				window.addEventListener("keyup", (e) => {
					if (e.key === "Enter") this.handleSerach()
				})
			},
			handleSerach() {
				const keywords = this.$data.input;
				// console.log(keywords)
				if (keywords && keywords.length > 0) {
					this.loadSite(keywords);
				} else {
					Notification.info({
						title: '提示',
						message: '请输入搜索关键字',
						duration: 0,
					});
				}
			},
			handleBack() {
				this.$refs[this.$data.switchType].goBack();
			},
			handleForward() {
				this.$refs[this.$data.switchType].goForward();
			},
			handleSwitch(val) {
				this.$data.switchType = val;
				if (val === 'comic') this.$data.by = 'online';
			},
			getSite(keywords) {
				for (const [k, v] of OPTIONS.entries()) {
					if (v.by === this.$data.by && v.switchType === this.$data.switchType) {
						const site = v.site(keywords);
						if (Object.prototype.toString.call(site) === '[object Object]') {
							const res = Object.assign(WEBSITE[site.site], {});
							res.url = site.url;
							return res;
						}
						return WEBSITE[v.site(keywords)];
					}
				}
			},
			loadSite(keywords) {
				// console.log("loadsite")
				const type = this.$data.switchType;
				console.log(type);
				const webview = this.$refs[type];
				const site = this.getSite(keywords);
				let url = site.url;
				if (keywords && site.keywords) url += keywords;
				if (this.$data[`${type}WebView`] === false) {
					this.$data[`${type}WebView`] = true;
					this.$data[`${type}url`] = url;
				} else if (keywords) {
					webview.loadURL(url);
				}
			},
			filter() {
				const type = this.$data.switchType;
				const webview = this.$refs[type];
				const keywords = this.$data.input;
				const site = this.getSite(keywords);
				webview.insertCSS(site.cssFilter());
				webview.executeJavaScript(site.jsFilter());
			},
		},
	};
</script>

<style lang="scss">
	.container {
		width: 100%;
		height: 100vh;
		background-color: #ccc;
		display: flex;
		flex-direction: column;
		justify-content: flex-start;
		align-items: center;
	}

	.option-box {
		display: flex;
		margin: 0 10px;

		.el-icon-arrow-left,
		.el-icon-arrow-right {
			margin: 0 10px;
			cursor: pointer;
			transition: all 200ms ease;
		}

		.el-icon-arrow-left:hover,
		.el-icon-arrow-right:hover {
			transform: scale(2, 2);
		}
	}

	.search-box {
		width: 100%;
		display: flex;
		align-items: center;
		transition: all 1s ease;
		flex-shrink: 0;
		position: relative;
		background-image: url(../../../../../static/img/IMG_0548.png);
		background-position: center top;
		background-size: cover;
	}

	.search-box.full {
		height: 100vh;
		justify-content: center;
	}

	.search-box.slide {
		height: 80px;
		justify-content: flex-start;
	}

	.switch-box {
		margin-left: 40px;
	}

	.webview {
		width: 100%;
		height: calc(100vh - 80px);
	}

	.el-select .el-input {
		transition: all 200ms ease;
		width: 120px;
	}

	.el-select .el-input:hover {
		transform: scale(1.1, 1.1);
		color: #666;
	}
	
	.el-icon-search{
		transition: all 200ms ease;
	}
	.el-input-group__append:hover .el-icon-search{
		transform: scale(1.1, 1.1);
		color: #666;
	}

	.input-with-select {
		width: 500px;
	}
</style>
