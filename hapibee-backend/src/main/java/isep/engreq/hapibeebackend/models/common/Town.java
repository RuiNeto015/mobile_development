package isep.engreq.hapibeebackend.models.common;

import lombok.Data;

@Data
public class Town {

    private Integer district;
    private Integer town; //"freguesia"
    private Integer county; //"concelho"
    private String name;

}
