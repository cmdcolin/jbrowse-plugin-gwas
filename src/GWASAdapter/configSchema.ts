import { ConfigurationSchema } from '@jbrowse/core/configuration'
import { types } from 'mobx-state-tree'

export default ConfigurationSchema(
  'GWASAdapter',
  {
    bedGzLocation: {
      type: 'fileLocation',
      defaultValue: { uri: '/path/to/my.txt.gz', locationType: 'UriLocation' },
    },
    index: ConfigurationSchema('GWASIndex', {
      indexType: {
        model: types.enumeration('IndexType', ['TBI', 'CSI']),
        type: 'stringEnum',
        defaultValue: 'TBI',
      },
      location: {
        type: 'fileLocation',
        defaultValue: {
          uri: '/path/to/my.txt.gz.tbi',
          locationType: 'UriLocation',
        },
      },
    }),
  },
  { explicitlyTyped: true },
)
