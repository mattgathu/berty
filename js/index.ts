/**
 * @format
 */

import 'node-libs-react-native/globals'
import 'react-native-gesture-handler'
import 'react-native-reanimated'
import 'string.fromcodepoint'
import '@berty/i18n'

import protobuf from 'protobufjs'
import { AppRegistry, NativeModules } from 'react-native'

import BridgeLogger from './packages/go-bridge/logger'
import App from './packages/messenger-app/App'
import { name as appName } from './packages/messenger-app/app.json'

protobuf.util.toJSONOptions = { longs: String, enums: Number, json: true }

if (typeof Buffer === 'undefined') {
	global.Buffer = require('buffer').Buffer
}

if (!__DEV__) {
	global.console = BridgeLogger(NativeModules.GoBridge)
	global.console.info('native bridge logger enabled')
}

AppRegistry.registerComponent(appName, () => App)
