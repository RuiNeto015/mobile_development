package isep.engreq.hapibeebackend.utils;

import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.SneakyThrows;
import org.apache.commons.codec.digest.DigestUtils;
import org.springframework.stereotype.Component;

@Component
public class MD5Utils {

    private static ObjectMapper mapper;

    public MD5Utils(ObjectMapper mapper) {
        MD5Utils.mapper = mapper;
    }

    public String getMd5Hash(String payload) {
        return DigestUtils.md5Hex(payload).toUpperCase();
    }

    @SneakyThrows
    public String getMd5Hash(Object payload) {
        String strPayload = getMd5Hash(mapper.writeValueAsString(payload));
        return getMd5Hash(strPayload);
    }

}
