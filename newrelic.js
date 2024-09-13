'use strict';

exports.config = {
  /**
   * Array of application names.
   */
  app_name: ['Your App Name'],
  /**
   * Your New Relic license key.
   */
  license_key: process.env.NEW_RELIC_LICENSE_KEY,
  logging: {
    /**
     * Level at which to log. 'trace' is most useful to New Relic when diagnosing
     * issues with the agent, 'info' and higher will impose the least overhead on
     * production applications.
     */
    level: 'info'
  },
  distributed_tracing: {
    /**
     * Distributed tracing lets you see the path that a request takes through your
     * distributed system. Enabling distributed tracing changes the behavior of some
     * New Relic features, so carefully consult the transition guide before you enable
     * this feature: https://docs.newrelic.com/docs/transition-guide-distributed-tracing
     */
    enabled: true
  }
};
