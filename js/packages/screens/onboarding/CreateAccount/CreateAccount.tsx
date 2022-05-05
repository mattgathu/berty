import { useHeaderHeight } from '@react-navigation/elements'
import LottieView from 'lottie-react-native'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { Platform, Vibration } from 'react-native'
import { StatusBar, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import OnboardingWrapper from '@berty/components/onboarding/OnboardingWrapper'
import { UnifiedText } from '@berty/components/shared-components/UnifiedText'
import { useStyles } from '@berty/contexts/styles'
import { ScreenFC } from '@berty/navigation'
import rnutil from '@berty/rnutil'
import { IOSOnlyKeyboardAvoidingView } from '@berty/rnutil/keyboardAvoiding'
import { PermissionType } from '@berty/rnutil/permissions'
import {
	useMountEffect,
	useNotificationsInhibitor,
	useThemeColor,
	accountService,
} from '@berty/store'

import { CreateAccountBox } from './components/CreateAccountBox'

const CreateAccountBody = () => {
	const { padding, margin, border, text } = useStyles()
	const colors = useThemeColor()
	const [defaultName, setDefaultName] = React.useState('')
	const { t } = useTranslation()
	const headerHeight = useHeaderHeight()
	const insets = useSafeAreaInsets()

	useMountEffect(() => {
		accountService
			.getUsername({})
			.then(reply => reply && setDefaultName(reply.username))
			.catch(err2 => console.warn('Failed to fetch username:', err2))
	})

	return (
		<View style={[{ flex: 1 }]}>
			<View>
				<LottieView
					source={require('@berty/assets/lottie/Berty_onboard_animation_assets2/Startup animation assets/Berty BG.json')}
					autoPlay
					loop
					style={{ width: '100%', position: 'absolute' }}
				/>
				<LottieView
					source={require('@berty/assets/lottie/Berty_onboard_animation_assets2/Startup animation assets/Shield appear.json')}
					autoPlay
					loop={false}
					onAnimationFinish={async () => {
						Vibration.vibrate(500)
						if (Platform.OS !== 'web') {
							await rnutil.checkPermissions(PermissionType.proximity)
						}
					}}
					style={{ position: 'absolute', width: '100%' }}
				/>
			</View>

			<IOSOnlyKeyboardAvoidingView
				style={{ flex: 1, justifyContent: 'flex-end' }}
				behavior='padding'
				keyboardVerticalOffset={headerHeight + insets.top}
			>
				{!!defaultName && <CreateAccountBox defaultName={defaultName} />}
			</IOSOnlyKeyboardAvoidingView>
			<View
				style={[
					padding.medium,
					margin.bottom.medium,
					margin.horizontal.medium,
					border.radius.large,
					{ backgroundColor: colors['main-background'] },
				]}
			>
				<View style={{ flexDirection: 'row', alignItems: 'center' }}>
					<View style={{ flex: 1, flexDirection: 'column', alignItems: 'center' }}>
						<UnifiedText style={[text.bold]}>
							{t('onboarding.create-account.good-to-know.title')}
						</UnifiedText>
						<UnifiedText>{t('onboarding.create-account.good-to-know.first-point')}</UnifiedText>
						<UnifiedText>{t('onboarding.create-account.good-to-know.second-point')}</UnifiedText>
					</View>
				</View>
			</View>
		</View>
	)
}

export const CreateAccount: ScreenFC<'Onboarding.CreateAccount'> = () => {
	useNotificationsInhibitor(() => true)
	const colors = useThemeColor()

	return (
		<OnboardingWrapper>
			<StatusBar backgroundColor={colors['background-header']} barStyle='light-content' />
			<CreateAccountBody />
		</OnboardingWrapper>
	)
}
