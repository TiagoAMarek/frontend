import { useMemo } from 'react';
import { format } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import { BadgeCheck, ChevronRight } from 'lucide-react';

import { IShelterListItemProps, IShelterAvailabilityProps } from './types';
import { cn, getAvailabilityProps, getSupplyPriorityProps } from '@/lib/utils';
import { Separator } from '../ui/separator';
import { Chip } from '../Chip';
import { Button } from '../ui/button';
import { SupplyPriority } from '@/service/supply/types';

const ShelterListItem = (props: IShelterListItemProps) => {
  const { data } = props;
  const { capacity, shelteredPeople } = data;
  const navigate = useNavigate();
  const { availability, className: availabilityClassName } =
    useMemo<IShelterAvailabilityProps>(
      () => getAvailabilityProps(capacity, shelteredPeople),
      [capacity, shelteredPeople]
    );

  const tags = useMemo(
    () =>
      data.shelterSupplies
        .filter((s) => s.priority >= SupplyPriority.Needing)
        .sort((a, b) => b.priority - a.priority),
    [data.shelterSupplies]
  );

  return (
    <div className="flex flex-col p-4 w-full border-2 border-border rounded-md gap-1 relative">
      <Button
        size="sm"
        variant="ghost"
        className="absolute top-4 right-4"
        onClick={() => navigate(`/abrigo/${data.id}`)}
      >
        <ChevronRight className="h-5 w-5" />
      </Button>
      <div className="flex items-center gap-1">
        {data.verified && (
          <BadgeCheck className="h-5 w-5 stroke-white fill-red-600" />
        )}
        <h3
          className="font-semibold text-lg mr-12 hover:cursor-pointer hover:text-slate-500"
          onClick={() => navigate(`/abrigo/${data.id}`)}
        >
          {data.name}
        </h3>
      </div>
      <h6 className={cn('font-semibold text-md', availabilityClassName)}>
        {availability}
      </h6>
      <h6 className="text-muted-foreground text-sm md:text-lg font-medium">
        {data.address}
      </h6>
      {data.shelterSupplies.length > 0 && (
        <div className="flex flex-col gap-3">
          <Separator className="mt-2" />
          <p className="text-muted-foreground text-sm md:text-lg font-medium">
            Precisa urgente de doações de:
          </p>
          <div className="flex gap-2 flex-wrap">
            {tags.map((s, idx) => (
              <Chip
                className={getSupplyPriorityProps(s.priority).className}
                key={idx}
                label={s.supply.name}
              />
            ))}
          </div>
        </div>
      )}
      {data.updatedAt && (
        <small className="text-sm md:text-md font-light text-muted-foreground mt-2">
          Atualizado em {format(data.updatedAt, 'dd/MM/yyyy HH:mm')}
        </small>
      )}
    </div>
  );
};

export { ShelterListItem };
