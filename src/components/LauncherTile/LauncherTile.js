import kind from '@enact/core/kind';
import {adaptEvent, forward, handle} from '@enact/core/handle';
import Image from '@enact/agate/Image';
import {Column, Cell} from '@enact/ui/Layout';
import Spottable from '@enact/spotlight/Spottable';
import React from 'react';
import PropTypes from 'prop-types';
import Skinnable from '@enact/agate/Skinnable';

import css from './LauncherTile.module.less';

// Originally by: Barak on Jan 12 '12 at 8:22
// https://stackoverflow.com/a/8831937/388092
const generateNumberFromString = (str) => {
	let hash = 0;
	if (str.length === 0) {
		return hash;
	}
	for (let i = 0; i < str.length; i++) {
		const char = str.charCodeAt(i);
		hash = ((hash << 5) - hash) + char;
		hash = hash & hash; // Convert to 32bit integer
	}
	return Math.abs(hash) / Math.pow(2, 32);
};

const LauncherTileBase = kind({
	name: 'LauncherTile',

	propTypes: {
		children: PropTypes.node,
		color: PropTypes.string,
		first: PropTypes.bool,
		icon: PropTypes.string,
		notification: PropTypes.string,
		onLaunchApp: PropTypes.func,
		progress: PropTypes.number	// Between zero and one (0 -> 1)
	},

	defaultProps: {
		progress: 1
	},

	styles: {
		css,
		className: 'tile'
	},

	handlers: {
		onClick: handle(
			forward('onClick'),
			adaptEvent(
				(ev, {appid}) => ({appid}),
				forward('onLaunchApp')
			)
		)
	},

	computed: {
		className: ({first, progress, styler}) => styler.append({first, progress: (progress < 1)}),
		notification: ({notification, progress}) => (
			notification || (progress < 1 ? `${Math.round(progress * 100)}%` : '')
		),
		style: ({children, color, progress, style}) => {
			if (!color) {
				const stringNum = generateNumberFromString(children);
				color = '#' + Math.floor((stringNum * (0x1000000 - 0x101010)) + 0x101010).toString(16);
			}

			return {
				...style,
				'--launcher-tile-progress': progress,
				'--launcher-tile-bg-color': color
			};
		}
	},

	render: ({children, icon, notification, ...rest}) => {
		delete rest.first;
		delete rest.color;
		delete rest.onLaunchApp;
		delete rest.progress;
		return (
			<div {...rest}>
				<Column className={css.content} align="center center">
					<div className={css.bg} />
					<div className={css.notification}>{notification}</div>
					<Cell className={css.iconCell} shrink>
						<Image className={css.icon} src={icon} />
						<div className={css.title}>{children}</div>
					</Cell>
				</Column>
			</div>
		);
	}
});

const LauncherTile = Spottable(Skinnable(LauncherTileBase));

export default LauncherTile;
export {LauncherTile, LauncherTileBase};