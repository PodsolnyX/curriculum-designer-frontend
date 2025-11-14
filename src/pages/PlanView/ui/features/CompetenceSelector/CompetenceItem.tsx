import {
  CompetenceDistributionType,
  CompetenceDto,
} from '@/api/axios-client.types.ts';
import React, { memo, useState } from 'react';
import { Checkbox, Tooltip } from 'antd';
import { DownOutlined, InfoCircleOutlined } from '@ant-design/icons';

interface CompetenceItemProps extends CompetenceDto {
  subjectId?: string | number;
  competencies: number[];
  competenceDistributionType: CompetenceDistributionType;
  onChange?: (competenceIds: number[]) => void;
}

const CompetenceItem = memo(
  ({
    id,
    name,
    index,
    indicators,
    competencies,
    competenceDistributionType,
    onChange,
  }: CompetenceItemProps) => {
    const [showIndicators, setShowIndicators] = useState(false);

    const onSelectCompetence = (id: number, remove?: boolean) => {
      onChange?.(
        remove
          ? competencies.filter((competence) => competence !== id)
          : [...competencies.map((competence) => competence), id],
      );
    };

    const countSelectedIndicators = indicators.reduce(
      (prev, indicator) =>
        prev +
        Number(
          !!competencies.find((competence) => competence === indicator.id),
        ),
      0,
    );

    return (
      <div>
        <div className={'flex justify-between items-center gap-1'}>
          <div className={'flex gap-1 items-center'}>
            <Checkbox
              indeterminate={
                countSelectedIndicators > 0 &&
                countSelectedIndicators < indicators.length
              }
              checked={
                (countSelectedIndicators === indicators.length &&
                  indicators.length > 0) ||
                !!competencies.find((competence) => competence === id)
              }
              disabled={
                competenceDistributionType ===
                CompetenceDistributionType.CompetenceIndicator
              }
              onChange={() =>
                onSelectCompetence(
                  id,
                  !!competencies.find((competence) => competence === id),
                )
              }
            />
            <span className={'text-[12px] text-black'}>{index}</span>
          </div>
          <div className={'flex gap-1 items-center'}>
            <Tooltip title={name} placement={'right'}>
              <InfoCircleOutlined className={'w-[12px] text-stone-400'} />
            </Tooltip>
            {indicators.length ? (
              <DownOutlined
                className={'w-[10px] text-stone-400'}
                rotate={showIndicators ? 180 : 0}
                onClick={() => setShowIndicators(!showIndicators)}
              />
            ) : null}
          </div>
        </div>
        {showIndicators ? (
          <div className={'flex flex-col gap-1 border-l border-stone-300 ml-2'}>
            {indicators.map((indicator) => (
              <div
                key={indicator.id}
                className={'ps-2 flex justify-between items-center gap-1'}
              >
                <div className={'flex gap-1 items-center'}>
                  <Checkbox
                    disabled={
                      competenceDistributionType ===
                      CompetenceDistributionType.Competence
                    }
                    checked={
                      !!competencies.find(
                        (competence) => competence === indicator.id,
                      )
                    }
                    onChange={() =>
                      onSelectCompetence(
                        indicator.id,
                        !!competencies.find(
                          (competence) => competence === indicator.id,
                        ),
                      )
                    }
                  />
                  <span className={'text-[12px] text-black'}>
                    {indicator.index}
                  </span>
                </div>
                <Tooltip title={indicator.name} placement={'right'}>
                  <InfoCircleOutlined
                    className={'w-[12px] text-stone-400'}
                    type={'secondary'}
                  />
                </Tooltip>
              </div>
            ))}
          </div>
        ) : null}
      </div>
    );
  },
);

export default CompetenceItem;
