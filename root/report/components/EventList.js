/*
 * @flow strict-local
 * Copyright (C) 2018 MetaBrainz Foundation
 *
 * This file is part of MusicBrainz, the open internet music database,
 * and is licensed under the GPL version 2, or (at your option) any
 * later version: http://www.gnu.org/licenses/gpl-2.0.txt
 */

import * as React from 'react';

import PaginatedResults from '../../components/PaginatedResults';
import Table from '../../components/Table';
import {
  defineArtistRolesColumn,
  defineDatePeriodColumn,
  defineEntityColumn,
  defineLocationColumn,
  defineTextColumn,
} from '../../utility/tableColumns';
import type {ReportEventT} from '../types';

type Props = {
  +items: $ReadOnlyArray<ReportEventT>,
  +pager: PagerT,
};

const EventList = ({
  items,
  pager,
}: Props): React.Element<typeof PaginatedResults> => {
  const existingEventItems = items.reduce((result, item) => {
    if (item.event != null) {
      result.push(item);
    }
    return result;
  }, []);

  const columns = React.useMemo(
    () => {
      const nameColumn = defineEntityColumn<ReportEventT>({
        columnName: 'event',
        descriptive: false, // since dates have their own column
        getEntity: result => result.event ?? null,
        title: l('Event'),
      });
      const typeColumn = defineTextColumn<ReportEventT>({
        columnName: 'type',
        getText: result => {
          const typeName = result.event?.typeName;
          return (nonEmpty(typeName)
            ? lp_attributes(typeName, 'event_type')
            : ''
          );
        },
        title: l('Type'),
      });
      const artistsColumn = defineArtistRolesColumn<ReportEventT>({
        columnName: 'performers',
        getRoles: result => result.event?.performers ?? [],
        title: l('Artists'),
      });
      const locationColumn = defineLocationColumn<ReportEventT>({
        getEntity: result => result.event ?? null,
      });
      const timeColumn = defineTextColumn<ReportEventT>({
        columnName: 'time',
        getText: result => result.event?.time ?? '',
        title: l('Time'),
      });
      const dateColumn = defineDatePeriodColumn<ReportEventT>({
        getEntity: result => result.event ?? null,
      });

      return [
        nameColumn,
        typeColumn,
        artistsColumn,
        locationColumn,
        dateColumn,
        timeColumn,
      ];
    },
    [],
  );

  return (
    <PaginatedResults pager={pager}>
      <Table columns={columns} data={existingEventItems} />
    </PaginatedResults>
  );
};

export default EventList;
