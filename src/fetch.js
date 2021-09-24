const queryString = require('query-string');
const fetch = require('node-fetch');

const {
  version,
  // eslint-disable-next-line import/no-unresolved
} = require('./package.json');
const {CODES} = require('./utils');


exports.fetchData = async (configOptions, reporter) => {
  console.time('Fetch Contentstack data');
  console.log('Starting to fetch data from Contentstack');

  let syncData = {};
  console.log('configOptions.expediteBuild', configOptions.expediteBuild);
  if (configOptions.expediteBuild) {
    console.log('configOptions--->', configOptions.syncToken);
    const syncEntryParams = configOptions.syncToken ? {
      sync_token: configOptions.syncToken,
    } : {
        init: true,
      };
    console.log('syncEntryParams--->', syncEntryParams);
    const syncAssetParams = configOptions.syncToken ? {
      sync_token: configOptions.syncToken,
    } : {
        init: true,
      };

    syncEntryParams.type = 'entry_published';
    syncAssetParams.type = 'asset_published';
    console.log('syncEntryParams.type==>', syncEntryParams);
    try {
      const [syncEntryData, syncAssetData] = await Promise.all([fetchSyncData(syncEntryParams, configOptions), fetchSyncData(syncAssetParams, configOptions)]);
      console.log('syncEntryData---->', JSON.stringify(syncEntryData));
      console.log('syncEntryData.sync_token', syncEntryData.sync_token);
      const data = syncEntryData.data.concat(syncAssetData.data);
      console.log('syncEntryData.sync_token[after]', syncEntryData.sync_token);
      syncData.data = data;
      syncData.token = null;
      syncData.sync_token = syncEntryData.sync_token;
    } catch (error) {
      reporter.panic({
        id: CODES.SyncError,
        context: {
          sourceMessage: `Fetching contentstack data failed [expediteBuild]. Please check https://www.contentstack.com/docs/developers/apis/content-delivery-api/ for more help.`
        },
        error
      });
    }
  } else {
    const syncParams = configOptions.syncToken ? {
      sync_token: configOptions.syncToken,
    } : {
        init: true,
      };

    try {
      syncData = await fetchSyncData(syncParams, configOptions);
    } catch (error) {
      reporter.panic({
        id: CODES.SyncError,
        context: {
          sourceMessage: `Fetching contentstack data failed. Please check https://www.contentstack.com/docs/developers/apis/content-delivery-api/ for more help.`
        },
        error
      });
    }
  }

  const contentstackData = {
    syncData: syncData.data,
    sync_token: syncData.sync_token,
  };

  console.timeEnd('Fetch Contentstack data');
  console.log('time ended', JSON.stringify(contentstackData));
  return {
    contentstackData,
  };
};


exports.fetchContentTypes = async (config) => {
  config.cdn = config.cdn ? config.cdn : 'https://cdn.contentstack.io/v3';

  const url = 'content_types';
  const responseKey = 'content_types';
  const query = {
    include_global_field_schema: true,
  };
  const allContentTypes = await getPagedData(url, config, responseKey, query);
  return allContentTypes;
};

const fetchSyncData = async (query, config) => {
  const url = 'stacks/sync';
  const response = await getSyncData(url, config, query, 'items');
  return response;
};

const fetchCsData = async (url, config, query) => {
  query = query || {};
  query.include_count = true;
  // query.api_key = config.api_key;
  // query.access_token = config.delivery_token;
  query.environment = config.environment;
  const queryParams = queryString.stringify(query);
  const apiUrl = `${config.cdn}/${url}?${queryParams}`;
  const option = {
    headers: {
      'X-User-Agent': `contentstack-gatsby-source-plugin-${version}`,
      api_key: config.api_key,
      access_token: config.delivery_token
    }
  };
  return new Promise((resolve, reject) => {
    fetch(apiUrl, option)
      .then(response => response.json())
      .then(data => {
        if (data.error_code) {
          console.error(data);
          reject(data);
        } else {
          resolve(data);
        }
      })
      .catch((err) => {
        console.error(err);
        reject(err);
      });
  });
};

const getPagedData = async (
  url,
  config,
  responseKey,
  query = {},
  skip = 0,
  limit = 100,
  aggregatedResponse = null,
) => {
  query.skip = skip;
  query.limit = limit;
  query.include_global_field_schema = true;
  const response = await fetchCsData(url, config, query);
  if (!aggregatedResponse) {
    aggregatedResponse = response[responseKey];
  } else {
    aggregatedResponse = aggregatedResponse.concat(response[responseKey]);
  }
  if (skip + limit <= response.count) {
    return getPagedData(
      url,
      config,
      responseKey,
      query = {},
      skip + limit,
      limit,
      aggregatedResponse,
    );
  }
  return aggregatedResponse;
};

const getSyncData = async (
  url,
  config,
  query,
  responseKey,
  aggregatedResponse = null,
) => {
  const response = await fetchCsData(url, config, query);
  if (!aggregatedResponse) {
    aggregatedResponse = {};
    aggregatedResponse.data = [];
    aggregatedResponse.data = response[responseKey];
    aggregatedResponse.sync_token = response.sync_token;
  } else {
    aggregatedResponse.data = aggregatedResponse.data || [];
    aggregatedResponse.data = aggregatedResponse.data.concat(response[responseKey]);
    aggregatedResponse.sync_token = response.sync_token ? response.sync_token : aggregatedResponse.sync_token;
  }
  if (response.pagination_token) {
    return getSyncData(
      url,
      config,
      query = {
        pagination_token: response.pagination_token,
      },
      responseKey,
      aggregatedResponse,
    );
  }
  return aggregatedResponse;
};
