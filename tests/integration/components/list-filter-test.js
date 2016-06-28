import Ember from 'ember';
import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import wait from 'ember-test-helpers/wait';

moduleForComponent('list-filter', 'Integration | Component | filter listing', {
  integration: true
});

const ITEMS = [{city: 'San Francisco'}, {city: 'Portland'}, {city: 'Seattle'}];
const FILTERED_ITEMS = [{city: 'San Francisco'}];

test('should initially load all listings', function (assert) {
  //actions to return promises, since they are potentially fetching data asychronously
  this.on('filterByCity', (val) => {
    if (val === '') {
      return Ember.RSVP.resolve(ITEMS);
    } else {
      return Ember.RSVP.resolve(FILTERED_ITEMS);
    }
  });

  // integration test sets up and uses component in the same way the app does
  this.render(hbs`
    {{#list-filter filter=(action 'filterByCity') as |results|}}
      <ul>
      {{#each results as |item|}}
        <li class="city">
          {{item.city}}
        </li>
      {{/each}}
      </ul>
    {{/list-filter}}
  `);

  // 'wait' function will return a promise that will wait for all promises
  // and xhr requests to resolve before running the contents of the 'then' block
  return wait().then(() => {
    assert.equal(this.$('.city').length, 3);
    assert.equal(this.$('.city').first().text().trim(), 'San Francisco');
  });
});

test('should update with matching listings', function (assert) {
  this.on('filterByCity', (val) => {
    if (val === '') {
      return Ember.RSVP.resolve(ITEMS);
    } else {
      return Ember.RSVP.resolve(FILTERED_ITEMS);
    }
  });

  this.render(hbs`
    {{#list-filter filter=(action 'filterByCity') as |results|}}
      <ul>
      {{#each results as |item|}}
        <li class="city">
          {{item.city}}
        </li>
      {{/each}}
      </ul>
      {{/list-filter}}
    `);
    // keyup event should invoke an action that will cause the list to be filtered
    this.$('.list-filter input').val('San').keyup();

    return wait().then(() => {
      assert.equal(this.$('.city').length, 1);
      assert.equal(this.$('.city').text().trim(), 'San Francisco');
    });
});