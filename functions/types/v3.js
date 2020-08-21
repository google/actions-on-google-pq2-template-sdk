// Copyright 2020, Google, Inc.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//   http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

/**
 * @typedef {Object} ConversationV3
 * @property {HandlerRequest} request - Original detect request.
 * @property {Object<string, any>} headers - Request headers.
 * @property {Handler} handler - Handler data.
 * @property {Intent} intent - Intent data.
 * @property {Scene} scene - Scene data.
 * @property {Session} session - Session data.
 * @property {User} user - User data.
 * @property {Device} device - Device data.
 * @property {Home} home - Home data.
 * @property {Expected} expected - Expected language and speech biasing data.
 * @property {Prompt} prompt - Prompt builder.
 * @property {boolean} overwrite - True to override static prompts.
 * @property {boolean} digested - True if responses has been digested.
 * @property {Function} json - Sets response JSON explicitly.
 * @property {Function} add - Adds response prompt items.
 * @property {Function} append - Append to current speech text.
 * @property {Function} response - Build output response.
 * @property {Function} serialize - Build serialized response JSON.
 */

/**
 * @typedef {Object} HandlerRequest
 * @property {Device} device
 * @property {Handler} handler
 * @property {Home} [home]
 * @property {Intent} intent
 * @property {Object<string, any>} [requestContext]
 * @property {Scene} [scene]
 * @property {Session} session
 * @property {User} user
 */

/**
 * @typedef {Object} Device
 * @property {Array<string>} capabilities
 */

/**
 * @typedef {Object} Handler
 * @property {string} name
 */

/**
 * @typedef {Object} Home
 * @property {Object<string, any>} params
 */

/**
 * @typedef {Object} Intent
 * @property {string} name
 * @property {Object<string, IntentParameterValue>} params
 * @property {string} [query]
 */

/**
 * @typedef {Object} IntentParameterValue
 * @property {string} original
 * @property {string} resolved
 */

/**
 * @typedef {Object} Scene
 * @property {string} name
 * @property {NextScene} [next]
 * @property {string} slotFillingStatus
 * @property {Object<string, Slot>} slots
 */

/**
 * @typedef {Object} Slot
 * @property {string} mode
 * @property {Object} [prompt]
 * @property {boolean} updated
 * @property {Object} value
 */

/**
 * @typedef {Object} NextScene
 * @property {string} name
 */

/**
 * @typedef {Object} Session
 * @property {string} id
 * @property {Object<string, any>} params
 * @property {Array<TypeOverride>} typeOverrides
 */

/**
 * @typedef {Object} TypeOverride
 * @property {string} mode
 * @property {string} name
 * @property {SynonymType} synonym
 * @property {string} typeOverrideMode
 */

/**
 * @typedef {Object} SynonymType
 * @property {Array<Entry>} entries
 */

/**
 * @typedef {Object} Entry
 * @property {EntryDisplay} [display]
 * @property {string} name
 * @property {Array<string>} synonyms
 */

/**
 * @typedef {Object} EntryDisplay
 * @property {string} description
 * @property {Image} image
 * @property {string} title
 */

/**
 * @typedef {Object} User
 * @property {string} accountLinkingStatus
 * @property {Engagement} engagement
 * @property {string} lastSeenTime
 * @property {string} locale
 * @property {Array<PackageEntitlements>} packageEntitlements
 * @property {Object<string, any>} params
 * @property {string} verificationStatus
 */

/**
 * @typedef {Object} Engagement
 * @property {Array<IntentSubscription>} dailyUpdateIntents
 * @property {Array<IntentSubscription>} pushNotificationIntents
 */

/**
 * @typedef {Object} IntentSubscription
 * @property {string} contentTitle
 * @property {string} intent
 */

/**
 * @typedef {Object} PackageEntitlements
 * @property {Array<Entitlement>} entitlements
 * @property {string} packageName
 */

/**
 * @typedef {Object} Entitlement
 * @property {SignedData} inAppDetails
 * @property {string} sku
 * @property {string} skuType
 */

/**
 * @typedef {Object} SignedData
 * @property {string} inAppDataSignature
 * @property {Object<string, any>} inAppPurchaseData
 */

/**
 * @typedef {Object} Expected
 * @property {string} language
 * @property {Array<string>} speech
 */

/**
 * @typedef {Object} Prompt
 * @property {Canvas} [canvas]
 * @property {Content} [content]
 * @property {Simple} [firstSimple]
 * @property {Simple} [lastSimple]
 * @property {Link} [link]
 * @property {OrderUpdate} [orderUpdate]
 * @property {boolean} [override]
 * @property {Array<Suggestion>} [suggestions]
 */

/**
 * @typedef {Object} Canvas
 * @property {Array<Object>} [data]
 * @property {boolean} [suppressMic]
 * @property {string} [url]
 */

/**
 * @typedef {Object} Content
 * @property {Canvas} [canvas]
 * @property {Card} [card]
 * @property {Collection} [collection]
 * @property {Image} [image]
 * @property {List} [list]
 * @property {Media} [media]
 * @property {Table} [table]
 */

/**
 * @typedef {Object} Content
 * @property {Canvas} [canvas]
 * @property {Card} [card]
 * @property {Collection} [collection]
 * @property {Image} [image]
 * @property {List} [list]
 * @property {Media} [media]
 * @property {Table} [table]
 */

/**
 * @typedef {Object} Card
 * @property {Link} [button]
 * @property {Image} [image]
 * @property {string} [imageFill]
 * @property {string} [subtitle]
 * @property {string} [text]
 * @property {string} [title]
 */

/**
 * @typedef {Object} Collection
 * @property {string} [imageFill]
 * @property {Array<CollectionItem>} items
 * @property {string} [subtitle]
 * @property {string} [title]
 */

/**
 * @typedef {Object} CollectionItem
 * @property {string} key
 */

/**
 * @typedef {Object} Image
 * @property {string} alt
 * @property {Number} [height]
 * @property {Number} [width]
 * @property {string} url
 */

/**
 * @typedef {Object} List
 * @property {Array<ListItem>} items
 * @property {string} [subtitle]
 * @property {string} [title]
 */

/**
 * @typedef {Object} ListItem
 * @property {string} key
 */

/**
 * @typedef {Object} Media
 * @property {Array<MediaObject>} mediaObjects
 * @property {string} mediaType
 * @property {Array<string>} [optionalMediaControls]
 * @property {string} [startOffset]
 */

/**
 * @typedef {Object} MediaObject
 * @property {string} description
 * @property {MediaImage} image
 * @property {string} name
 * @property {string} url
 */

/**
 * @typedef {Object} MediaImage
 * @property {Image} icon
 * @property {Image} large
 */

/**
 * @typedef {Object} Table
 * @property {Link} button
 * @property {Array<TableColumn>} columns
 * @property {Image} [image]
 * @property {Array<TableRow>} rows
 * @property {string} [subtitle]
 * @property {string} [title]
 */

/**
 * @typedef {Object} TableColumn
 * @property {string} align
 * @property {string} header
 */

/**
 * @typedef {Object} TableRow
 * @property {Array<TableCell>} cells
 * @property {boolean} divider
 */

/**
 * @typedef {Object} TableCell
 * @property {string} text
 */

/**
 * @typedef {Object} Simple
 * @property {string} [speech]
 * @property {string} [text]
 */

/**
 * @typedef {Object} Link
 * @property {string} name
 * @property {OpenUrl} open
 */

/**
 * @typedef {Object} OpenUrl
 * @property {string} hint
 * @property {string} url
 */

/**
 * @typedef {Object} OrderUpdate
 * @property {Object} order
 * @property {string} reason
 * @property {string} type
 * @property {string} updateMask
 * @property {UserNotification} userNotification
 */

/**
 * @typedef {Object} UserNotification
 * @property {string} text
 * @property {string} title
 */

/**
 * @typedef {Object} Suggestion
 * @property {string} title
 */
