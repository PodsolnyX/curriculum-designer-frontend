import { Select, Tag } from 'antd';
import { DepartmentDto } from '@/api/axios-client.types.ts';
import { useGetDepartmentsQuery } from '@/api/axios-client/DepartmentQuery.ts';
import { useParams } from 'react-router-dom';

interface DepartmentSelectProps {
  department?: DepartmentDto | null;
  onChange(department?: DepartmentDto): void;
  type?: 'tag' | 'input';
}

const DepartmentsSelector = ({
  department,
  onChange,
  type = 'tag',
}: DepartmentSelectProps) => {
  const { id } = useParams<{ id: string }>();
  const { data: departments } = useGetDepartmentsQuery(
    { curriculumId: Number(id) },
    { enabled: !!id },
  );

  return type === 'tag' ? (
    <Tag>{department?.name || '-'}</Tag>
  ) : (
    <Select
      className={'w-full'}
      size={'small'}
      optionFilterProp="label"
      filterSort={(optionA, optionB) =>
        (optionA?.label ?? '')
          .toLowerCase()
          .localeCompare((optionB?.label ?? '').toLowerCase())
      }
      showSearch={true}
      options={
        departments?.length
          ? departments.map((department) => ({
              value: department.id,
              label: department.name,
            }))
          : []
      }
      placeholder={'Выберите кафедру'}
      onChange={(value, option) =>
        value
          ? onChange({ id: option?.value || 0, name: option?.label })
          : onChange(undefined)
      }
      value={department ? department.id : undefined}
    />
  );
};

export default DepartmentsSelector;
